import { useSelector } from '@xstate/react'
import { assign, createActor, emit, not, raise, setup } from 'xstate'

import { type SearchData } from '../../types'
import { searchCbs } from '../event-search'
import { notifyUi, uiCbs } from '../event-ui'
import { fromMatrixSvg } from '../viewer/layout/coord'
import type { BalloonProps } from './Balloon'
import {
  calcBalloonLayout,
  calcBalloonPaths,
  type BalloonPaths,
} from './balloon-common'
import {
  openCloseClose,
  openCloseClosed,
  openCloseIsVisible,
  openCloseOpen,
  openCloseOpened,
  openCloseReset,
  type OpenCloseOp,
} from './openclose'
import { updateBalloonStyleRefs } from './style'
import {
  updateScrollStyleRefs,
  updateDetailStyleRefs,
  updateHeaderStyleRefs,
} from './style'
import {
  type OpenCloseMap,
  type UiContext,
  type UiDetailContent,
  type UiEmitted,
  type UiEvent,
  type UiPart,
} from './ui-types'

function doOpenCloseMap(op: OpenCloseOp) {
  return function (m: OpenCloseMap, part: UiPart) {
    const a = m[part]
    const b = op(a)
    m[part] = b === null ? a : b
    return m
  }
}

function handleOpenCloseMap(m: OpenCloseMap, part: UiPart) {
  const oc = m[part]
  const op = oc.open ? openCloseOpened : openCloseClosed
  return doOpenCloseMap(op)(m, part)
}

function isVisible(m: OpenCloseMap, part: UiPart): boolean {
  const oc = m[part]
  return openCloseIsVisible(oc)
}

const uiMachine = setup({
  types: {} as {
    context: UiContext
    events: UiEvent
    emitted: UiEmitted
  },
  guards: {
    isHeaderVisible: ({ context: { m } }) => isVisible(m, 'header'),
    isDetailVisible: ({ context: { m } }) => isVisible(m, 'detail'),
    animationEnded: ({ context: { animationEnded } }) =>
      animationEnded.header && animationEnded.detail,
  },
  actions: {
    startCancel: assign({ canceling: () => true }),
    endCancel: assign({ canceling: () => false }),
    open: assign({
      m: ({ context: { m } }, { part }: { part: UiPart }) =>
        doOpenCloseMap(openCloseOpen)(m, part),
    }),
    close: assign({
      m: ({ context: { m } }, { part }: { part: UiPart }) =>
        doOpenCloseMap(openCloseClose)(m, part),
    }),
    handle: assign({
      m: ({ context: { m } }, { part }: { part: UiPart }) =>
        handleOpenCloseMap(m, part),
    }),
    updateDetail: assign({
      detail: (_, detail: UiDetailContent) => detail,
      p: (_, { psvg, layout }: UiDetailContent) =>
        fromMatrixSvg(layout).transformPoint(psvg),
    }),
    updateBalloon: assign({
      balloon: ({ context: { detail, p } }) =>
        detail && p && calcBalloonLayout(detail.layout, p),
    }),
    updateBalloonPaths: assign({
      balloonPaths: ({ context: { balloon } }) =>
        (balloon?._hv && calcBalloonPaths(balloon._hv, balloon._size)) ||
        undefined,
    }),
    updateHeaderStyle: ({ context }) =>
      updateHeaderStyleRefs(context.m['header']),
    updateBalloonStyle: ({ context }) =>
      context.balloon &&
      updateBalloonStyleRefs(context.balloon, context.m['detail']),
    updateDetailStyle: ({ context }) =>
      updateDetailStyleRefs(context.m['detail']),
    updateDetailScrollStyle: ({ context }) =>
      updateScrollStyleRefs(context.m['detail']),
  },
}).createMachine({
  type: 'parallel',
  id: 'ui',
  context: ({ input }) => ({
    ...input,
    all: { open: false, animating: false },
    canceling: false,
    m: {
      header: openCloseReset(true),
      detail: openCloseReset(false),
    },
    animationEnded: { header: true, detail: true },
  }),
  on: {
    RENDERED: {
      actions: ['updateHeaderStyle', 'updateDetailStyle', 'updateBalloonStyle'],
    },
  },
  states: {
    Ui: {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            FLOOR: {
              target: 'Floor',
            },
            MENU: {
              target: 'Menu',
            },
            DETAIL: {
              actions: [
                {
                  type: 'updateDetail',
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  params: ({ event: { type, ...detail } }) => detail,
                },
                'updateBalloon',
                'updateBalloonPaths',
              ],
              target: 'Detail',
            },
            HELP: {
              target: 'Help',
            },
          },
        },
        Floor: {},
        Menu: {},
        Detail: {
          initial: 'Waiting',
          onDone: 'Idle',
          states: {
            Waiting: {
              on: {
                OPEN: [
                  { guard: not('animationEnded') },
                  {
                    actions: assign({
                      animationEnded: { header: false, detail: false },
                    }),
                    target: 'Opening',
                  },
                ],
                CANCEL: {
                  target: 'Closed',
                },
              },
            },
            Opening: {
              entry: [
                { type: 'close', params: { part: 'header' } },
                { type: 'open', params: { part: 'detail' } },
                'updateHeaderStyle',
                'updateBalloonStyle',
                'updateDetailStyle',
                'updateDetailScrollStyle',
              ],
              on: {
                DONE: [
                  { guard: 'isHeaderVisible' },
                  { guard: not('isDetailVisible') },
                  { target: 'Opened' },
                ],
              },
            },
            Opened: {
              on: {
                CANCEL: [
                  { guard: not('animationEnded') },
                  {
                    actions: assign({
                      animationEnded: { header: false, detail: false },
                    }),
                    target: 'Closing',
                  },
                ],
              },
            },
            Closing: {
              entry: [
                'startCancel',
                { type: 'open', params: { part: 'header' } },
                { type: 'close', params: { part: 'detail' } },
                'updateHeaderStyle',
                'updateBalloonStyle',
                'updateDetailStyle',
                'updateDetailScrollStyle',
              ],
              exit: 'endCancel',
              on: {
                DONE: [
                  { guard: not('isHeaderVisible') },
                  { guard: 'isDetailVisible' },
                  { target: 'Closed' },
                ],
              },
            },
            Closed: {
              entry: emit({ type: 'CLOSE.DONE' }),
              type: 'final',
            },
          },
        },
        Help: {},
      },
    },
    Handler: {
      on: {
        'HEADER.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'header' } },
            'updateHeaderStyle',
            assign({
              animationEnded: ({ context }) => ({
                ...context.animationEnded,
                header: true,
              }),
            }),
            raise({ type: 'DONE' }),
          ],
        },
        'DETAIL.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'detail' } },
            'updateBalloonStyle',
            'updateDetailStyle',
            'updateDetailScrollStyle',
            assign({
              animationEnded: ({ context }) => ({
                ...context.animationEnded,
                detail: true,
              }),
            }),
            raise({ type: 'DONE' }),
          ],
        },
      },
    },
  },
})

////

const uiActor = createActor(uiMachine)

export function uiActorStart(): void {
  uiActor.start()
}
export function uiSend(ev: UiEvent): void {
  uiActor.send(ev)
}
export function useDetail(): UiDetailContent | undefined {
  return useSelector(uiActor, (ui) => ui.context.detail)
}
export function useBalloon(): BalloonProps | undefined {
  return useSelector(uiActor, (ui) => ui.context.balloon)
}
export function useBalloonPaths(): BalloonPaths | undefined {
  return useSelector(uiActor, (ui) => ui.context.balloonPaths)
}

uiActor.on('CLOSE.DONE', notifyUi.closeDone)

////

export function uiCbsStart(): void {
  searchCbs.endDone.add((data: Readonly<SearchData>) =>
    uiActor.send({ type: 'DETAIL', ...data })
  )
  uiCbs.open.add(() => notifyUi.openDone(true))
  uiCbs.openDone.add((ok: boolean) =>
    uiActor.send({ type: ok ? 'OPEN' : 'CANCEL' })
  )
  uiCbs.close.add(() => uiActor.send({ type: 'CANCEL' }))
}

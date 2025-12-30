import { useSelector } from '@xstate/react'
import { assign, createActor, emit, not, raise, setup } from 'xstate'
import { type SearchData } from '../../types'
import { searchCbs } from '../event-search'
import { notifyUiCloseDone, uiCbs } from '../event-ui'
import { vecZero } from '../vec/prefixed'
import { emptyLayoutCoord, fromMatrixSvg } from '../viewer/layout/coord'
import {
  openCloseClose,
  openCloseClosed,
  openCloseIsVisible,
  openCloseOpen,
  openCloseOpened,
  openCloseReset,
  type OpenCloseOp,
} from './openclose'
import { resetDetailScroll } from './ui-react'
import {
  type OpenCloseMap,
  type UiContext,
  type UiDetailContent,
  type UiEmitted,
  type UiEvent,
  type UiPart,
} from './ui-types'

const emptyDetail: UiDetailContent = {
  p: vecZero,
  psvg: vecZero,
  fidx: 0,
  layout: emptyLayoutCoord,
  info: { title: '' },
}

export function isDetailEmpty(detail: UiDetailContent): boolean {
  const values = Object.values(detail.info)
  return (
    values.length === 1 && typeof values[0] === 'string' && values[0] === ''
  )
}

////

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
  },
}).createMachine({
  type: 'parallel',
  id: 'ui',
  context: ({ input }) => ({
    ...input,
    all: { open: false, animating: false },
    canceling: false,
    detail: emptyDetail,
    m: {
      header: openCloseReset(true),
      detail: openCloseReset(false),
    },
    animationEnded: { header: true, detail: true },
  }),
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
              actions: assign({
                detail: ({ event: { psvg, fidx, info, layout } }) => {
                  const m = fromMatrixSvg(layout)
                  return {
                    psvg,
                    p: m.transformPoint(psvg),
                    fidx,
                    info,
                    layout,
                  }
                },
              }),
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
                      all: { open: true, animating: true },
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
              ],
              on: {
                DONE: [
                  { guard: 'isHeaderVisible' },
                  { guard: not('isDetailVisible') },
                  {
                    actions: assign({
                      all: { open: true, animating: false },
                    }),
                    target: 'Opened',
                  },
                ],
              },
            },
            Opened: {
              on: {
                CANCEL: [
                  { guard: not('animationEnded') },
                  {
                    actions: assign({
                      all: { open: false, animating: true },
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
              ],
              exit: 'endCancel',
              on: {
                DONE: [
                  { guard: not('isHeaderVisible') },
                  { guard: 'isDetailVisible' },
                  {
                    actions: assign({
                      all: { open: false, animating: false },
                    }),
                    target: 'Closed',
                  },
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
export function useUiContext(): UiContext {
  return useSelector(uiActor, (ui) => ui.context)
}

uiActor.on('CLOSE.DONE', notifyUiCloseDone)

////

export function uiCbsStart(): void {
  searchCbs.endDone.add((data: Readonly<SearchData>) =>
    uiActor.send({ type: 'DETAIL', ...data })
  )
  uiCbs.openDone.add((ok: boolean) =>
    uiActor.send({ type: ok ? 'OPEN' : 'CANCEL' })
  )
  uiCbs.close.add(() => uiActor.send({ type: 'CANCEL' }))
  uiCbs.closeDone.add(() => {
    requestAnimationFrame(
      () => resetDetailScroll() // XXX
    )
  })
}

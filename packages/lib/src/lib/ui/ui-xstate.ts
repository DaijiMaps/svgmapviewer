import { useSelector } from '@xstate/react'
import { assign, createActor, emit, not, raise, setup } from 'xstate'
import {
  notifyUiCloseDone,
  searchEndDoneCbs,
  uiCloseCbs,
  uiCloseDoneCbs,
  uiOpenDoneCbs,
} from '../../event'
import { type SearchData } from '../../types'
import { vecZero } from '../vec/prefixed'
import { emptyLayoutCoord, fromMatrixSvg } from '../viewer/coord'
import {
  type OpenClose,
  openCloseClose,
  openCloseClosed,
  openCloseIsVisible,
  type OpenCloseOp,
  openCloseOpen,
  openCloseOpened,
  openCloseReset,
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
                detail: ({ event: { psvg, info, layout } }) => {
                  const m = fromMatrixSvg(layout)
                  return {
                    psvg,
                    p: m.transformPoint(psvg),
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

export function useOpenCloseAll(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.all)
}
export function useDetail(): UiDetailContent {
  return useSelector(uiActor, (ui) => ui.context.detail)
}
export function useOpenCloseHeader(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['header'])
}
export function useOpenCloseDetail(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['detail'])
}

////

const uiActor = createActor(uiMachine)
uiActor.on('CLOSE.DONE', notifyUiCloseDone)

export function uiActorStart(): void {
  uiActor.start()
}
export function uiSend(ev: UiEvent): void {
  uiActor.send(ev)
}

////

function uiDetail(data: Readonly<SearchData>) {
  uiActor.send({ type: 'DETAIL', ...data })
}
function uiOpen(ok: boolean) {
  uiActor.send({ type: ok ? 'OPEN' : 'CANCEL' })
}
function uiCancel() {
  uiActor.send({ type: 'CANCEL' })
}
function uiCloseDone() {
  requestAnimationFrame(
    () => resetDetailScroll() // XXX
  )
}

export function uiCbsStart(): void {
  searchEndDoneCbs.add(uiDetail)
  uiOpenDoneCbs.add(uiOpen)
  uiCloseCbs.add(uiCancel)
  uiCloseDoneCbs.add(uiCloseDone)
}

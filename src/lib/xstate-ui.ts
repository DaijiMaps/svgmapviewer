import {
  ActorRefFrom,
  assign,
  enqueueActions,
  not,
  raise,
  setup,
  StateFrom,
} from 'xstate'
import {
  OpenClose,
  openCloseClose,
  openCloseClosed,
  openCloseIsVisible,
  OpenCloseOp,
  openCloseOpen,
  openCloseOpened,
  openCloseReset,
} from './open-close'
import { Dir, SearchRes, UiCloseCb } from './types'

export type UiPart = 'header' | 'footer' | 'shadow' | 'balloon' | 'detail'

export interface UiInput {
  closeDoneCbs: UiCloseCb[]
}

export type UiDetailContent = SearchRes & { dir: Dir }

export interface UiContext {
  canceling: boolean
  closeDoneCbs: UiCloseCb[]
  detail: null | UiDetailContent
  openCloseMap: Map<UiPart, OpenClose>
}

export type UiModeEvent =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'FLOOR' }
  | { type: 'MENU' }
  | ({ type: 'DETAIL' } & UiDetailContent)
  | { type: 'HELP' }

export type UiPartEvent =
  | { type: 'HEADER.ANIMATION.END' }
  | { type: 'FOOTER.ANIMATION.END' }
  | { type: 'SHADOW.ANIMATION.END' }
  | { type: 'BALLOON.ANIMATION.END' }
  | { type: 'DETAIL.ANIMATION.END' }

export type UiInternalEvent = { type: 'DONE' }

export type UiEvent = UiModeEvent | UiPartEvent | UiInternalEvent

function doOpenCloseMap(op: OpenCloseOp) {
  return function (context: UiContext, part: UiPart) {
    const m = context.openCloseMap
    const a = m.get(part)
    if (a === undefined) {
      return m
    } else {
      const b = op(a)
      return b === null ? m : m.set(part, b)
    }
  }
}

function handleOpenCloseMap(context: UiContext, part: UiPart) {
  const m = context.openCloseMap
  const oc = m.get(part)
  if (oc === undefined) {
    return m
  } else {
    const op = oc.open ? openCloseOpened : openCloseClosed
    return doOpenCloseMap(op)(context, part)
  }
}

function isVisible(context: UiContext, part: UiPart): boolean {
  const m = context.openCloseMap
  const oc = m.get(part)
  return oc !== undefined && openCloseIsVisible(oc)
}

export const uiMachine = setup({
  types: {} as {
    input: UiInput
    context: UiContext
    events: UiEvent
  },
  guards: {
    isHeaderVisible: ({ context }) => isVisible(context, 'header'),
    isFooterVisible: ({ context }) => isVisible(context, 'footer'),
    isShadowVisible: ({ context }) => isVisible(context, 'shadow'),
    isBalloonVisible: ({ context }) => isVisible(context, 'balloon'),
    isDetailVisible: ({ context }) => isVisible(context, 'detail'),
  },
  actions: {
    startCancel: enqueueActions(({ enqueue }) => {
      enqueue.assign({
        canceling: () => true,
      })
    }),
    endCancel: enqueueActions(({ enqueue, context: { closeDoneCbs } }) => {
      enqueue(() => closeDoneCbs.forEach((cb) => cb()))
      enqueue.assign({
        canceling: () => false,
      })
    }),
  },
}).createMachine({
  type: 'parallel',
  id: 'ui',
  context: ({ input }) => ({
    ...input,
    canceling: false,
    detail: null,
    openCloseMap: new Map()
      .set('header', openCloseReset(true))
      .set('footer', openCloseReset(true))
      .set('shadow', openCloseReset(false))
      .set('balloon', openCloseReset(false))
      .set('detail', openCloseReset(false)),
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
                detail: ({ event: { p, psvg, info, dir } }) => ({
                  p,
                  psvg,
                  info,
                  dir,
                }),
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
                OPEN: {
                  target: 'Opening',
                },
                CANCEL: {
                  target: 'Closed',
                },
              },
            },
            Opening: {
              entry: [
                assign({
                  openCloseMap: ({ context }) =>
                    doOpenCloseMap(openCloseOpen)(context, 'shadow'),
                }),
                assign({
                  openCloseMap: ({ context }) =>
                    doOpenCloseMap(openCloseOpen)(context, 'balloon'),
                }),
                assign({
                  openCloseMap: ({ context }) =>
                    doOpenCloseMap(openCloseOpen)(context, 'detail'),
                }),
              ],
              on: {
                DONE: [
                  { guard: not('isShadowVisible') },
                  { guard: not('isBalloonVisible') },
                  { guard: not('isDetailVisible') },
                  { target: 'Opened' },
                ],
              },
            },
            Opened: {
              on: {
                CANCEL: {
                  actions: 'startCancel',
                  target: 'Closing',
                },
              },
            },
            Closing: {
              entry: [
                assign({
                  openCloseMap: ({ context }) =>
                    doOpenCloseMap(openCloseClose)(context, 'shadow'),
                }),
                assign({
                  openCloseMap: ({ context }) =>
                    doOpenCloseMap(openCloseClose)(context, 'balloon'),
                }),
                assign({
                  openCloseMap: ({ context }) =>
                    doOpenCloseMap(openCloseClose)(context, 'detail'),
                }),
              ],
              on: {
                DONE: [
                  { guard: 'isShadowVisible' },
                  { guard: 'isBalloonVisible' },
                  { guard: 'isDetailVisible' },
                  {
                    actions: 'endCancel',
                    target: 'Closed',
                  },
                ],
              },
            },
            Closed: {
              entry: assign({ detail: () => null }),
              type: 'final',
            },
          },
        },
        Help: {},
      },
    },
    Handler: {
      on: {
        // XXX HEADER.ANIMATION.END
        // XXX FOOTER.ANIMATION.END
        'SHADOW.ANIMATION.END': {
          actions: [
            assign({
              openCloseMap: ({ context }) =>
                handleOpenCloseMap(context, 'shadow'),
            }),
            raise({ type: 'DONE' }),
          ],
        },
        'BALLOON.ANIMATION.END': {
          actions: [
            assign({
              openCloseMap: ({ context }) =>
                handleOpenCloseMap(context, 'balloon'),
            }),
            raise({ type: 'DONE' }),
          ],
        },
        'DETAIL.ANIMATION.END': {
          actions: [
            assign({
              openCloseMap: ({ context }) =>
                handleOpenCloseMap(context, 'detail'),
            }),
            raise({ type: 'DONE' }),
          ],
        },
      },
    },
  },
})

export type UiMachine = typeof uiMachine

export type UiState = StateFrom<typeof uiMachine>

export type UiSend = (events: UiEvent) => void

export type UiRef = ActorRefFrom<typeof uiMachine>

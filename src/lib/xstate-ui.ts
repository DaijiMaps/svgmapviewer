import {
  ActorRefFrom,
  assign,
  emit,
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
import { Dir, SearchRes } from './types'

export type UiPart = 'header' | 'footer' | 'shadow' | 'balloon' | 'detail'

type OpenCloseMap = Record<UiPart, OpenClose>

export type UiDetailContent = SearchRes & { dir: Dir }

export interface UiContext {
  canceling: boolean
  detail: null | UiDetailContent
  m: OpenCloseMap
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

export type UiEmitted = { type: 'CLOSE.DONE' }

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

export const uiMachine = setup({
  types: {} as {
    context: UiContext
    events: UiEvent
    emitted: UiEmitted
  },
  guards: {
    isHeaderVisible: ({ context: { m } }) => isVisible(m, 'header'),
    isFooterVisible: ({ context: { m } }) => isVisible(m, 'footer'),
    isShadowVisible: ({ context: { m } }) => isVisible(m, 'shadow'),
    isBalloonVisible: ({ context: { m } }) => isVisible(m, 'balloon'),
    isDetailVisible: ({ context: { m } }) => isVisible(m, 'detail'),
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
    canceling: false,
    detail: null,
    m: {
      header: openCloseReset(true),
      footer: openCloseReset(true),
      shadow: openCloseReset(false),
      balloon: openCloseReset(false),
      detail: openCloseReset(false),
    },
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
                { type: 'close', params: { part: 'header' } },
                { type: 'close', params: { part: 'footer' } },
                { type: 'open', params: { part: 'shadow' } },
                { type: 'open', params: { part: 'balloon' } },
                { type: 'open', params: { part: 'detail' } },
              ],
              on: {
                DONE: [
                  { guard: 'isHeaderVisible' },
                  { guard: 'isFooterVisible' },
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
                  target: 'Closing',
                },
              },
            },
            Closing: {
              entry: [
                'startCancel',
                { type: 'open', params: { part: 'header' } },
                { type: 'open', params: { part: 'footer' } },
                { type: 'close', params: { part: 'shadow' } },
                { type: 'close', params: { part: 'balloon' } },
                { type: 'close', params: { part: 'detail' } },
              ],
              exit: 'endCancel',
              on: {
                DONE: [
                  { guard: not('isHeaderVisible') },
                  { guard: not('isFooterVisible') },
                  { guard: 'isShadowVisible' },
                  { guard: 'isBalloonVisible' },
                  { guard: 'isDetailVisible' },
                  { target: 'Closed' },
                ],
              },
            },
            Closed: {
              entry: emit({ type: 'CLOSE.DONE' }),
              exit: assign({ detail: () => null }),
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
            raise({ type: 'DONE' }),
          ],
        },
        'FOOTER.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'footer' } },
            raise({ type: 'DONE' }),
          ],
        },
        'SHADOW.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'shadow' } },
            raise({ type: 'DONE' }),
          ],
        },
        'BALLOON.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'balloon' } },
            raise({ type: 'DONE' }),
          ],
        },
        'DETAIL.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'detail' } },
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

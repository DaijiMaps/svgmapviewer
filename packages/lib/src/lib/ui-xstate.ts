import {
  type ActorRefFrom,
  assign,
  createActor,
  emit,
  not,
  raise,
  setup,
  type StateFrom,
} from 'xstate'
import { notifyCloseDone, registerCbs } from './config'
import { emptyLayoutCoord, type LayoutCoord } from './coord'
import { fromSvg } from './layout'
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
import { type Info, type SearchRes } from './types'
import { type VecVec, vecZero } from './vec/prefixed'

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

export type UiPart =
  | 'header'
  | 'footer'
  | 'right'
  | 'shadow'
  | 'balloon'
  | 'detail'

type OpenCloseMap = Record<UiPart, OpenClose>

export type UiDetailContent = SearchRes & {
  p: VecVec
  layout: LayoutCoord
}

export interface UiContext {
  canceling: boolean
  detail: UiDetailContent
  m: OpenCloseMap
}

export type UiModeEvent =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'FLOOR' }
  | { type: 'MENU' }
  | ({ type: 'DETAIL' } & Pick<UiDetailContent, 'psvg' | 'info' | 'layout'>)
  | { type: 'HELP' }

export type UiPartEvent =
  | { type: 'HEADER.ANIMATION.END' }
  | { type: 'FOOTER.ANIMATION.END' }
  | { type: 'RIGHT.ANIMATION.END' }
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

const uiMachine = setup({
  types: {} as {
    context: UiContext
    events: UiEvent
    emitted: UiEmitted
  },
  guards: {
    isHeaderVisible: ({ context: { m } }) => isVisible(m, 'header'),
    isFooterVisible: ({ context: { m } }) => isVisible(m, 'footer'),
    isRightVisible: ({ context: { m } }) => isVisible(m, 'right'),
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
    detail: emptyDetail,
    m: {
      header: openCloseReset(true),
      footer: openCloseReset(true),
      right: openCloseReset(true),
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
                detail: ({ event: { psvg, info, layout } }) => ({
                  psvg,
                  p: fromSvg(psvg, layout),
                  info,
                  layout,
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
                { type: 'close', params: { part: 'right' } },
                { type: 'open', params: { part: 'shadow' } },
                { type: 'open', params: { part: 'balloon' } },
                { type: 'open', params: { part: 'detail' } },
              ],
              on: {
                DONE: [
                  { guard: 'isHeaderVisible' },
                  { guard: 'isFooterVisible' },
                  { guard: 'isRightVisible' },
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
                { type: 'open', params: { part: 'right' } },
                { type: 'close', params: { part: 'shadow' } },
                { type: 'close', params: { part: 'balloon' } },
                { type: 'close', params: { part: 'detail' } },
              ],
              exit: 'endCancel',
              on: {
                DONE: [
                  { guard: not('isHeaderVisible') },
                  { guard: not('isFooterVisible') },
                  { guard: not('isRightVisible') },
                  { guard: 'isShadowVisible' },
                  { guard: 'isBalloonVisible' },
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
            raise({ type: 'DONE' }),
          ],
        },
        'FOOTER.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'footer' } },
            raise({ type: 'DONE' }),
          ],
        },
        'RIGHT.ANIMATION.END': {
          actions: [
            { type: 'handle', params: { part: 'right' } },
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

type UiMachine = typeof uiMachine

type UiState = StateFrom<typeof uiMachine>

type UiSend = (events: UiEvent) => void

type UiRef = ActorRefFrom<typeof uiMachine>

const selectDetail = (ui: UiState) => ui.context.detail
const selectOpenCloseHeader = (ui: UiState) => ui.context.m['header']
const selectOpenCloseFooter = (ui: UiState) => ui.context.m['footer']
const selectOpenCloseRight = (ui: UiState) => ui.context.m['right']
const selectOpenCloseShadow = (ui: UiState) => ui.context.m['shadow']
const selectOpenCloseBalloon = (ui: UiState) => ui.context.m['balloon']
const selectOpenCloseDetail = (ui: UiState) => ui.context.m['detail']

////

const uiActor = createActor(uiMachine)
uiActor.on('CLOSE.DONE', notifyCloseDone)
uiActor.start()

registerCbs({
  searchEndDoneCb: uiDetail,
  uiOpenDoneCb: uiOpen,
  uiCloseCb: uiCancel,
})

function uiDetail(psvg: VecVec, info: Info, layout: LayoutCoord) {
  uiActor.send({ type: 'DETAIL', psvg, info, layout })
}
function uiOpen(ok: boolean) {
  uiActor.send({ type: ok ? 'OPEN' : 'CANCEL' })
}
function uiCancel() {
  uiActor.send({ type: 'CANCEL' })
}

////

export function uiActorStart(): void {
  uiActor.start()
}

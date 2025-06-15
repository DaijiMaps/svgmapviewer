import { useSelector } from '@xstate/react'
import { assign, createActor, emit, not, raise, setup } from 'xstate'
import { notifyUiCloseDone, registerCbs } from './config-xstate'
import { emptyLayoutCoord, fromMatrixSvg, type LayoutCoord } from './coord'
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
import { type Info } from './types'
import type {
  OpenCloseMap,
  UiContext,
  UiDetailContent,
  UiEmitted,
  UiEvent,
  UiPart,
} from './ui-types'
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
    //isFooterVisible: ({ context: { m } }) => isVisible(m, 'footer'),
    //isRightVisible: ({ context: { m } }) => isVisible(m, 'right'),
    //isShadowVisible: ({ context: { m } }) => isVisible(m, 'shadow'),
    //isBalloonVisible: ({ context: { m } }) => isVisible(m, 'balloon'),
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
    all: { open: false, animating: false },
    canceling: false,
    detail: emptyDetail,
    m: {
      header: openCloseReset(true),
      //footer: openCloseReset(true),
      //right: openCloseReset(true),
      //shadow: openCloseReset(false),
      //balloon: openCloseReset(false),
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
                OPEN: {
                  actions: assign({
                    all: { open: true, animating: true },
                  }),
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
                //{ type: 'close', params: { part: 'footer' } },
                //{ type: 'close', params: { part: 'right' } },
                //{ type: 'open', params: { part: 'shadow' } },
                //{ type: 'open', params: { part: 'balloon' } },
                { type: 'open', params: { part: 'detail' } },
              ],
              on: {
                DONE: [
                  { guard: 'isHeaderVisible' },
                  //{ guard: 'isFooterVisible' },
                  //{ guard: 'isRightVisible' },
                  //{ guard: not('isShadowVisible') },
                  //{ guard: not('isBalloonVisible') },
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
                CANCEL: {
                  actions: assign({
                    all: { open: false, animating: true },
                  }),
                  target: 'Closing',
                },
              },
            },
            Closing: {
              entry: [
                'startCancel',
                { type: 'open', params: { part: 'header' } },
                //{ type: 'open', params: { part: 'footer' } },
                //{ type: 'open', params: { part: 'right' } },
                //{ type: 'close', params: { part: 'shadow' } },
                //{ type: 'close', params: { part: 'balloon' } },
                { type: 'close', params: { part: 'detail' } },
              ],
              exit: 'endCancel',
              on: {
                DONE: [
                  { guard: not('isHeaderVisible') },
                  //{ guard: not('isFooterVisible') },
                  //{ guard: not('isRightVisible') },
                  //{ guard: 'isShadowVisible' },
                  //{ guard: 'isBalloonVisible' },
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
            raise({ type: 'DONE' }),
          ],
        },
        /*
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
        */
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

export function useOpenCloseAll(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.all)
}
export function useDetail(): UiDetailContent {
  return useSelector(uiActor, (ui) => ui.context.detail)
}
export function useOpenCloseHeader(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['header'])
}
/*
export function useOpenCloseFooter(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['footer'])
}
export function useOpenCloseRight(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['right'])
}
export function useOpenCloseShadow(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['shadow'])
}
export function useOpenCloseBalloon(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['balloon'])
}
*/
export function useOpenCloseDetail(): OpenClose {
  return useSelector(uiActor, (ui) => ui.context.m['detail'])
}

////

const uiActor = createActor(uiMachine)
uiActor.on('CLOSE.DONE', notifyUiCloseDone)
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
export function uiSend(ev: UiEvent): void {
  uiActor.send(ev)
}

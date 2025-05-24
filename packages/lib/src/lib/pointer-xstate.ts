import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import {
  ActorRefFrom,
  and,
  assign,
  emit,
  not,
  raise,
  setup,
  StateFrom,
  stateIn,
} from 'xstate'
import {
  Animation,
  animationEndLayout,
  animationHome,
  animationMove,
  animationZoom,
} from './animation'
import { BoxBox, boxCenter } from './box/prefixed'
import { configActor } from './config-xstate'
import { Drag, dragMove, dragStart } from './drag'
import { keyToDir, keyToZoom } from './key'
import {
  emptyLayout,
  expandLayoutCenter,
  Layout,
  makeLayout,
  recenterLayout,
  relocLayout,
  scrollLayout,
  toSvg,
} from './layout'
import { getCurrentScroll, getScroll } from './scroll'
import { scrollMachine } from './scroll-xstate'
import { styleActor } from './style-xstate'
import { syncViewBox } from './svg'
import {
  discardTouches,
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  isMultiTouch,
  isMultiTouchEnding,
  resetTouches,
  Touches,
} from './touch'
import { Info, SearchRes } from './types'
import { VecVec as Vec, vecMul, vecSub, vecVec } from './vec/prefixed'

// XXX
// XXX
// XXX
// XXX - refactor touch handler into a separate state machine
// XXX   - make it track touch state independently & unconditionally
// XXX
// XXX - review expand behavior & make it efficient
// XXX   - only one re-rendering (RENDERED)
// XXX   - syncScroll after RENDERED
// XXX   - style via styleActor
// XXX
// XXX
// XXX

// XXX
const DIST_LIMIT = 10

//const EXPAND_DEFAULT = 3
//const EXPAND_PANNING = 9

type PointerModePointing = 'pointing'
type PointerModePanning = 'panning'
type PointerModeLocked = 'locked'
export type PointerMode =
  | PointerModePointing
  | PointerModePanning
  | PointerModeLocked
const pointerModePointing: PointerModePointing = 'pointing'
const pointerModePanning: PointerModePanning = 'panning'
const pointerModeLocked: PointerModeLocked = 'locked'

export type PointerContext = {
  origLayout: Layout
  layout: Layout
  nextLayout: null | Layout
  cursor: Vec
  expand: number
  m: null | Vec
  z: null | number
  zoom: number
  homing: boolean
  touches: Touches
  drag: null | Drag
  animation: null | Animation
  debug: boolean
  mode: PointerMode
  clickLock: boolean

  dragging: boolean // XXX for CSS
  expanding: number // XXX
  animating: boolean // XXX
  rendered: boolean

  mapHtmlRendered: boolean
}

type PointerExternalEvent =
  | { type: 'ANIMATION.END' }
  | { type: 'DEBUG' }
  | { type: 'RESIZE'; layout: Layout; force: boolean }
  | { type: 'LAYOUT.RESET' }
  | { type: 'MODE'; mode: PointerMode }
  | { type: 'RENDERED' }
  | { type: 'RENDERED.MAP-HTML' }
  | { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
  | { type: 'SCROLL.SLIDE.DONE' }
  | { type: 'SCROLL.SYNCSYNC.DONE'; scroll: BoxBox }
  | { type: 'ZOOM.ZOOM'; z: -1 | 1 }

type PointerEventAnimation = { type: 'ANIMATION' } | { type: 'ANIMATION.DONE' }
type PointerEventDrag =
  | { type: 'DRAG' }
  | { type: 'DRAG.DONE' }
  | { type: 'DRAG.CANCEL' }
type PointerEventTouch =
  | { type: 'TOUCH' }
  | { type: 'TOUCH.DONE' }
  | { type: 'TOUCH.START.DONE' }
  | { type: 'TOUCH.MOVE.DONE' }
  | { type: 'TOUCH.END.DONE' }
type PointerEventSlide =
  | { type: 'SLIDE' }
  | { type: 'SLIDE.DONE' }
  | { type: 'SLIDE.DRAG.DONE' }
  | { type: 'SLIDE.DRAG.SLIDE' }
type PointerEventExpand =
  | { type: 'EXPAND'; n?: number }
  | { type: 'EXPAND.CANCEL' }
  | { type: 'EXPAND.DONE' }
  | { type: 'UNEXPAND' }
  | { type: 'UNEXPAND.DONE' }
type PointerEventMoveZoomPan =
  | { type: 'MOVE' }
  | { type: 'MOVE.DONE' }
  | { type: 'ZOOM' }
  | { type: 'ZOOM.DONE' }
  | { type: 'PAN' }
  | { type: 'PAN.DONE' }
  | { type: 'PAN.UPDATE' }
  | { type: 'PAN.ZOOM' }
  | { type: 'PAN.ZOOM.ZOOM' }
  | { type: 'PAN.ZOOM.ZOOM.DONE' }
type PointerEventSearch =
  | { type: 'SEARCH.END'; res: Readonly<SearchRes> }
  | { type: 'SEARCH.LOCK'; psvg: Vec }
  | { type: 'SEARCH.UNLOCK' }
type PointerEventLock = { type: 'LOCK'; ok: boolean } | { type: 'UNLOCK' }

type PointerInternalEvent =
  | PointerEventAnimation
  | PointerEventDrag
  | PointerEventTouch
  | PointerEventSlide
  | PointerEventExpand
  | PointerEventMoveZoomPan
  | PointerEventSearch
  | PointerEventLock

type UIEventClick = { type: 'CLICK'; ev: React.MouseEvent<HTMLDivElement> }
type UIEventContextMenu = {
  type: 'CONTEXTMENU'
  ev: React.MouseEvent<HTMLDivElement>
}
type UIEventKeyDown = { type: 'KEY.DOWN'; ev: KeyboardEvent }
type UIEventKeyUp = { type: 'KEY.UP'; ev: KeyboardEvent }
type UIEventPointerCancel = {
  type: 'POINTER.CANCEL'
  ev: React.PointerEvent<HTMLDivElement>
}
type UIEventPointerDown = {
  type: 'POINTER.DOWN'
  ev: React.PointerEvent<HTMLDivElement>
}
type UIEventPointerMove = {
  type: 'POINTER.MOVE'
  ev: React.PointerEvent<HTMLDivElement>
}
type UIEventPointerUp = {
  type: 'POINTER.UP'
  ev: React.PointerEvent<HTMLDivElement>
}
type UIEventTouchCancel = {
  type: 'TOUCH.CANCEL'
  ev: React.TouchEvent<HTMLDivElement>
}
type UIEventTouchEnd = {
  type: 'TOUCH.END'
  ev: React.TouchEvent<HTMLDivElement>
}
type UIEventTouchMove = {
  type: 'TOUCH.MOVE'
  ev: React.TouchEvent<HTMLDivElement>
}
type UIEventTouchStart = {
  type: 'TOUCH.START'
  ev: React.TouchEvent<HTMLDivElement>
}
type UIEventWheel = {
  type: 'WHEEL'
  ev: React.WheelEvent<HTMLDivElement>
}
type UIEventScroll = { type: 'SCROLL'; ev: Event | React.UIEvent }
type UIEventAnimationEnd = {
  type: 'ANIMATION.END'
  ev: React.AnimationEvent<HTMLDivElement>
}

export type ReactUIEvent =
  | UIEventAnimationEnd
  | UIEventClick
  | UIEventContextMenu
  | UIEventPointerCancel
  | UIEventPointerDown
  | UIEventPointerMove
  | UIEventPointerUp
  | UIEventScroll
  | UIEventTouchCancel
  | UIEventTouchEnd
  | UIEventTouchMove
  | UIEventTouchStart
  | UIEventWheel

export type RawUIEvent = UIEventKeyDown | UIEventKeyUp

export type UIEvent = RawUIEvent | ReactUIEvent

export type _PointerEvent =
  | PointerExternalEvent
  | PointerInternalEvent
  | UIEvent

export type PointerEmitted =
  | { type: 'SEARCH'; psvg: Vec }
  | {
      type: 'SEARCH.END.DONE'
      psvg: Vec
      info: Info
      layout: Layout
    }
  | { type: 'LOCK'; ok: boolean }
  | { type: 'LAYOUT'; layout: Layout }
  | { type: 'ZOOM.START'; layout: Layout; zoom: number; z: number }
  | { type: 'ZOOM.END'; layout: Layout; zoom: number }
  | { type: 'MODE'; mode: PointerMode }

//// pointerMachine

export const pointerMachine = setup({
  types: {} as {
    context: PointerContext
    events: _PointerEvent
    emitted: PointerEmitted
  },
  guards: {
    // key
    shouldDebug: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'd',
    shouldReset: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'r',
    shouldZoom: (_, { ev }: { ev: KeyboardEvent }) => keyToZoom(ev.key) !== 0,
    shouldMove: (_, { ev }: { ev: KeyboardEvent }) =>
      'hjkl'.indexOf(ev.key) >= 0,
    shouldPan: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'm',

    // touch
    isMultiTouch: ({ context: { touches } }) => isMultiTouch(touches),
    isMultiTouchEnding: ({ context: { touches } }) =>
      isMultiTouchEnding(touches),
    isTouchZooming: ({ context }) => context.touches.z !== null,

    // expand
    isExpanded: ({ context }) => context.expand !== 1,

    // animation + zoom
    isAnimating: ({ context: { animation } }) => animation !== null,
    isMoving: ({ context: { animation } }) =>
      animation !== null && animation.move !== null,
    isZooming: ({ context: { animation } }) =>
      animation !== null && animation.zoom !== null,
    isZoomingIn: ({ context: { z } }) => z !== null && z > 0,

    // click lock
    isClickLocked: ({ context: { clickLock } }) => clickLock,

    // states
    isIdle: and([
      stateIn({ Pointer: 'Idle' }),
      stateIn({ Dragger: 'Inactive' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    isDragging: and([
      stateIn({ Pointer: 'Dragging.Active' }),
      stateIn({ Dragger: 'Sliding' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    isSliding: and([
      stateIn({ Pointer: 'Dragging.Active' }),
      stateIn({ Dragger: 'Sliding' }),
      stateIn({ Slider: { PointerHandler: 'Active' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    isSlidingDragBusy: and([
      stateIn({ Pointer: 'Dragging.Active' }),
      stateIn({ Dragger: 'Sliding' }),
      stateIn({ Slider: { PointerHandler: 'Active' } }),
      stateIn({ Slider: { ScrollHandler: 'Busy' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    isTouching: and([
      stateIn({ Pointer: 'Touching' }),
      stateIn({ Dragger: 'Inactive' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
  },
  actions: {
    toggleDebug: assign({
      debug: ({ context }): boolean => !context.debug,
    }),

    //
    // scroll
    //
    syncScroll: ({ context: { layout }, system }) =>
      system.get('scroll1').send({
        type: 'SYNC',
        pos: layout.scroll,
      }),
    syncScrollSync: ({ context: { layout }, system }) =>
      system.get('scroll1').send({
        type: 'SYNCSYNC',
        pos: layout.scroll,
      }),
    renderAndSyncScroll: ({ context: { layout }, system }) =>
      requestAnimationFrame(() => {
        system.get('scroll1').send({
          type: 'SYNC',
          pos: layout.scroll,
        })
      }),
    slideScroll: ({ context: { layout, drag }, system }): void => {
      if (drag !== null) {
        system.get('scroll1').send({
          type: 'SLIDE',
          P: layout.scroll,
          Q: drag.move,
        })
      }
    },
    resetScroll: ({ context: { drag }, system }): void => {
      if (drag !== null) {
        system.get('scroll1').send({
          type: 'SYNC',
          pos: drag.start,
        })
      }
    },
    getScroll: ({ system }): void => {
      system.get('scroll1').send({
        type: 'GET',
      })
    },

    //
    // move + zoom
    //
    moveKey: assign({
      m: ({ context: { layout } }, { ev }: { ev: KeyboardEvent }): Vec =>
        vecMul(
          keyToDir(ev.key),
          vecVec(layout.container.width * 0.5, layout.container.height * 0.5)
        ),
    }),
    moveCursor: assign({
      m: ({ context: { layout, cursor } }): Vec =>
        vecSub(boxCenter(layout.container), cursor),
    }),
    zoomKey: assign({
      z: (_, { ev }: { ev: KeyboardEvent }): number => keyToZoom(ev.key),
    }),
    zoomWheel: assign({
      z: (_, { ev }: { ev: React.WheelEvent<HTMLDivElement> }): number =>
        ev.deltaY < 0 ? 1 : -1,
    }),
    zoomTouches: assign({
      z: ({ context: { touches, z } }): null | number =>
        touches.z !== null ? touches.z : z,
      cursor: ({ context: { cursor, touches } }) =>
        touches.z !== null && touches.cursor !== null ? touches.cursor : cursor,
    }),
    zoomHome: assign({
      z: (): null | number => null,
      zoom: () => 1,
      homing: () => true,
    }),
    zoomEvent: assign({
      z: (_, { z }: { z: -1 | 1 }): number => z,
    }),
    startMove: assign({
      animation: ({
        context: { layout, drag, animation, m },
      }): null | Animation =>
        drag === null || m === null
          ? animation
          : animationMove(layout, drag, m),
      z: () => null,
    }),
    endMove: assign({
      layout: ({ context: { layout, drag } }): Layout =>
        drag === null ? layout : relocLayout(layout, drag.move),
      animation: () => null,
    }),
    startZoom: assign({
      animation: ({ context: { layout, cursor, z } }): null | Animation =>
        z === null
          ? animationHome(layout, makeLayout(layout.config))
          : animationZoom(layout, z, cursor),
    }),
    updateZoom: assign({
      nextLayout: ({ context: { layout, animation } }): null | Layout =>
        animation === null ? null : animationEndLayout(layout, animation),
    }),
    endZoom: assign({
      layout: ({ context: { layout, nextLayout } }): Layout =>
        nextLayout === null ? layout : nextLayout,
      nextLayout: () => null,
      animation: () => null,
      z: () => null,
      zoom: ({ context: { z, zoom } }) =>
        z === null ? zoom : zoom * Math.pow(2, z),
    }),
    syncAnimation: ({ context: { animation } }) => {
      styleActor.send({ type: 'STYLE.ANIMATION', animation })
    },

    //
    // layout
    //
    recenterLayout: assign({
      layout: ({ context: { layout, drag } }): Layout =>
        drag === null ? layout : recenterLayout(layout, drag.start),
    }),
    scrollLayout: assign({
      layout: (
        { context: { layout } },
        { scroll }: { scroll: BoxBox }
      ): Layout => {
        return scrollLayout(layout, scroll)
      },
    }),
    resetLayout: assign({
      layout: ({ context: { layout } }): Layout => makeLayout(layout.config),
    }),
    syncViewBox: ({ context: { layout } }) => {
      syncViewBox('.container > .content.svg > svg', layout.svg)
    },
    syncLayout: ({ context: { layout, rendered } }) => {
      styleActor.send({ type: 'STYLE.LAYOUT', layout, rendered })
      configActor.send({ type: 'CONFIG.LAYOUT', layout, force: false })
    },

    //
    // expand
    //
    expand: assign({
      layout: ({ context: { layout, expand } }, { n }: { n: number }): Layout =>
        expandLayoutCenter(layout, n / expand),
      expand: (_, { n }: { n: number }): number => n,
    }),

    //
    // cursor
    //
    resetCursor: assign({
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
    cursor: assign({
      cursor: (
        //{ context: { mode, cursor } },
        _,
        {
          ev,
        }: {
          ev: MouseEvent | React.MouseEvent | PointerEvent | React.PointerEvent
        }
        //): Vec => (mode !== 'pointing' ? cursor : vecVec(ev.pageX, ev.pageY)),
      ): Vec => vecVec(ev.pageX, ev.pageY),
    }),

    //
    // drag
    //
    // XXX startScroll
    startDrag: assign({
      drag: ({ context: { layout, cursor } }): Drag =>
        dragStart(layout.scroll, cursor),
    }),
    // XXX moveScroll
    moveDrag: assign({
      drag: (
        { context: { drag } },
        { ev }: { ev: PointerEvent | React.PointerEvent }
      ): null | Drag =>
        drag === null ? null : dragMove(drag, vecVec(ev.pageX, ev.pageY)),
    }),
    // XXX endScroll
    endDrag: assign({
      drag: () => null,
    }),
    syncDragging: ({ context: { dragging } }) => {
      styleActor.send({ type: 'STYLE.DRAGGING', dragging })
    },

    //
    // touch
    //
    startTouches: assign({
      touches: (
        { context: { touches } },
        { ev }: { ev: TouchEvent | React.TouchEvent }
      ) => handleTouchStart(touches, ev),
    }),
    moveTouches: assign({
      touches: (
        { context: { touches } },
        { ev }: { ev: TouchEvent | React.TouchEvent }
      ) => handleTouchMove(touches, ev, DIST_LIMIT),
    }),
    endTouches: assign({
      touches: (
        { context: { touches } },
        { ev }: { ev: TouchEvent | React.TouchEvent }
      ) => handleTouchEnd(touches, ev),
    }),
    cursorTouches: assign({
      cursor: ({ context: { touches, cursor } }) =>
        touches.cursor !== null ? touches.cursor : cursor,
    }),
    resetTouches: assign({
      touches: () => resetTouches(),
      cursor: ({ context: { touches, cursor } }) =>
        touches.cursor !== null ? touches.cursor : cursor,
    }),
    discardTouches: assign({
      touches: ({ context: { touches } }) => discardTouches(touches),
      cursor: ({ context: { touches, cursor } }) =>
        touches.cursor !== null ? touches.cursor : cursor,
    }),

    //
    // mode
    //
    resetMode: assign({ mode: pointerModePointing }),
    setModeToPanning: assign({
      mode: pointerModePanning,
      // XXX resetCursor
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
    setModeToLocked: assign({
      mode: () => pointerModeLocked,
    }),
    syncMode: ({ context: { mode } }) => {
      styleActor.send({ type: 'STYLE.MODE', mode })
    },

    // click lock
    lockClick: assign({ clickLock: true }),
    unlockClick: assign({ clickLock: false }),

    updateExpanding: assign({
      expanding: ({ context }): number => context.expanding + 1,
    }),
    clearExpanding: assign({ expanding: () => 0 }),
  },
  actors: {
    scroll: scrollMachine,
  },
}).createMachine({
  type: 'parallel',
  id: 'pointer',
  context: {
    origLayout: emptyLayout,
    layout: emptyLayout,
    nextLayout: null,
    cursor: boxCenter(emptyLayout.container),
    expand: 1,
    m: null,
    z: null,
    zoom: 1,
    homing: false,
    touches: resetTouches(),
    drag: null,
    animation: null,
    debug: false,
    mode: pointerModePanning,
    clickLock: false,
    dragging: false,
    expanding: 0,
    animating: false,
    rendered: false,
    mapHtmlRendered: false,
  },
  invoke: [
    {
      src: 'scroll',
      systemId: 'scroll1',
    },
  ],
  on: {
    RENDERED: {},
    'RENDERED.MAP-HTML': {
      actions: assign({
        mapHtmlRendered: () => true,
      }),
    },
    'SEARCH.LOCK': [
      {
        //guard: 'isIdle',
        actions: [
          emit({ type: 'LOCK', ok: true }),
          'setModeToLocked',
          emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
          'syncMode',
        ],
      },
      {
        actions: emit({ type: 'LOCK', ok: false }),
      },
    ],
  },
  states: {
    /*
    Pointer: {
      initial: 'None',
      states: {
        None: {},
        Idle: {
          on: {
            RESIZE: [
              // XXX force layout (resize)
              {
                guard: ({ event }) => event.force,
                actions: [
                  assign({ rendered: () => false }),
                  assign({
                    origLayout: ({ event }) => event.layout,
                    layout: ({ event }) => event.layout,
                    cursor: ({ event }) => boxCenter(event.layout.container),
                  }),
                  'syncLayout',
                ],
                target: 'Resizing',
              },
              {
                actions: [
                  assign({ rendered: () => false }),
                  assign({
                    origLayout: ({ event }) => event.layout,
                    layout: ({ event }) => event.layout,
                    cursor: ({ event }) => boxCenter(event.layout.container),
                  }),
                  'syncLayout',
                  'renderAndSyncScroll',
                ],
                target: 'Layouting',
              },
            ],
            'LAYOUT.RESET': {
              guard: 'isIdle',
              actions: 'zoomHome',
              target: 'Homing',
            },
            MODE: [
              {
                target: '#pointer-panning',
              },
            ],
            'ZOOM.ZOOM': {
              guard: 'isIdle',
              actions: {
                type: 'zoomEvent',
                params: ({ event: { z } }) => ({ z }),
              },
              target: 'Zooming',
            },
            DEBUG: {
              actions: 'toggleDebug',
            },
            'KEY.DOWN': [
              {
                guard: not('isIdle'),
                target: 'Idle',
              },
            ],
            'KEY.UP': [
              {
                guard: {
                  type: 'shouldDebug',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                actions: 'toggleDebug',
              },
              {
                guard: {
                  type: 'shouldReset',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                actions: 'zoomHome',
                target: 'Homing',
              },
              {
                guard: {
                  type: 'shouldPan',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                target: '#pointer-panning',
              },
              {
                guard: not('isIdle'),
                target: 'Idle',
              },
              {
                guard: {
                  type: 'shouldMove',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                actions: [
                  {
                    type: 'moveKey',
                    params: ({ event }) => ({ ev: event.ev }),
                  },
                ],
                target: 'Moving',
              },
              {
                guard: {
                  type: 'shouldZoom',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                actions: [
                  {
                    type: 'zoomKey',
                    params: ({ event }) => ({ ev: event.ev }),
                  },
                ],
                target: 'Zooming',
              },
            ],
            CLICK: {
              guard: not('isClickLocked'),
              actions: [
                'resetTouches',
                {
                  type: 'cursor',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                emit(({ context: { layout, cursor } }) => ({
                  type: 'SEARCH',
                  psvg: toSvg(cursor, layout),
                })),
              ],
              target: 'Idle',
            },
            CONTEXTMENU: {
              guard: not('isClickLocked'),
              target: '#pointer-panning',
            },
            WHEEL: {
              guard: 'isIdle',
              actions: [
                { type: 'cursor', params: ({ event }) => ({ ev: event.ev }) },
                {
                  type: 'zoomWheel',
                  params: ({ event }) => ({ ev: event.ev }),
                },
              ],
              target: 'Zooming',
            },
            DRAG: {
              guard: 'isIdle',
              target: 'Dragging.Active',
            },
            TOUCH: [
              {
                guard: not('isIdle'),
              },
              {
                target: '#pointer-touching',
              },
            ],
            'SEARCH.END': [
              {
                guard: not('isIdle'),
              },
              {
                actions: [
                  emit(({ context, event }) => {
                    return {
                      type: 'SEARCH.END.DONE',
                      psvg: event.res.psvg,
                      info: event.res.info,
                      layout: context.layout,
                    }
                  }),
                ],
              },
            ],
            'SEARCH.LOCK': [
              {
                guard: not('isIdle'),
              },
              {
                target: 'Locked',
              },
            ],
          },
        },
        Resizing: {
          initial: 'Canceling',
          onDone: 'Layouting',
          states: {
            Canceling: {
              entry: raise({ type: 'EXPAND.CANCEL' }),
              on: {
                'UNEXPAND.DONE': {
                  actions: [
                    assign({ rendered: () => false }),
                    'updateExpanding',
                  ],
                  target: 'Rendering',
                },
              },
            },
            Rendering: {
              on: {
                RENDERED: {
                  actions: 'clearExpanding',
                  target: 'Rendering2',
                },
              },
            },
            Rendering2: {
              on: {
                RENDERED: {
                  target: 'Done',
                },
              },
            },
            Done: {
              type: 'final',
            },
          },
        },
        Layouting: {
          // XXX waiting for DOM to be stable (reflow)
          // XXX especially right after resize
          after: { 500: { target: 'Layouting2' } },
        },
        Layouting2: {
          initial: 'Assigned',
          onDone: 'Panning',
          states: {
            Assigned: {
              entry: raise({ type: 'EXPAND', n: EXPAND_DEFAULT }),
              on: {
                'EXPAND.DONE': {
                  target: 'Done',
                  actions: [
                    emit(({ context: { layout } }) => ({
                      type: 'LAYOUT',
                      layout,
                    })),
                    assign({ rendered: () => true }),
                    'syncLayout',
                  ],
                },
              },
            },
            Done: {
              entry: 'syncLayout',
              type: 'final',
            },
          },
        },
        Dragging: {
          initial: 'Active',
          onDone: 'Idle',
          states: {
            Active: {
              entry: [assign({ dragging: () => true }), 'syncDragging'],
              on: {
                TOUCH: { target: 'TouchWaitingForDragDone' },
                'DRAG.DONE': { target: 'DragWaitingForClick' },
                'TOUCH.END': { target: 'DragWaitingForDragDone' },
                CLICK: { target: 'DragWaitingForDragDone' },
              },
            },
            DragWaitingForClick: {
              on: {
                CLICK: { target: 'Done' },
                'TOUCH.END': { target: 'Done' },
              },
            },
            DragWaitingForDragDone: {
              on: {
                'DRAG.DONE': {
                  target: 'Done',
                },
              },
            },
            TouchWaitingForDragDone: {
              on: {
                'DRAG.DONE': [
                  {
                    target: '#pointer-touching',
                  },
                ],
              },
            },
            Done: {
              entry: [assign({ dragging: () => false }), 'syncDragging'],
              type: 'final',
            },
          },
        },
        Touching: {
          id: 'pointer-touching',
          on: {
            'TOUCH.DONE': { target: 'Idle' },
          },
        },
        Panning: {
          id: 'pointer-panning',
          initial: 'Active',
          onDone: 'Idle',
          states: {
            Active: {
              entry: raise({ type: 'PAN' }),
              on: {
                'PAN.UPDATE': {
                  target: 'Updating',
                },
                'PAN.ZOOM': {
                  target: 'Zooming',
                },
                'PAN.DONE': {
                  actions: [
                    //'recenterLayout',
                    'resetScroll',
                    'endDrag',
                  ],
                  target: 'Unexpanding',
                },
              },
            },
            Updating: {
              on: {
                'PAN.DONE': {
                  target: 'Active',
                },
              },
            },
            Zooming: {
              entry: [raise({ type: 'PAN.ZOOM.ZOOM' }, { delay: 1 })],
              on: {
                'PAN.ZOOM.ZOOM.DONE': {
                  target: 'Active',
                },
              },
            },
            Unexpanding: {
              entry: raise({ type: 'UNEXPAND' }),
              on: {
                'UNEXPAND.DONE': {
                  // XXX expand to fit the whole map
                  target: 'Expanding',
                },
              },
            },
            Expanding: {
              entry: raise({ type: 'EXPAND', n: EXPAND_DEFAULT }),
              on: {
                'EXPAND.DONE': {
                  target: 'Done',
                },
              },
            },
            Done: {
              type: 'final',
            },
          },
        },
        Moving: {
          entry: raise({ type: 'MOVE' }),
          on: {
            'MOVE.DONE': {
              target: 'Idle',
            },
          },
        },
        Zooming: {
          entry: [raise({ type: 'ZOOM' })],
          on: {
            'ZOOM.DONE': {
              target: 'Idle',
            },
          },
        },
        Homing: {
          entry: raise({ type: 'ZOOM' }),
          on: {
            'ZOOM.DONE': {
              actions: ['resetLayout', 'resetCursor'],
              target: 'Layouting',
            },
          },
        },
        Locked: {
          on: {
            'SEARCH.UNLOCK': {
              actions: [
                'resetMode',
                emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
                'syncMode',
              ],
              target: 'Idle',
            },
          },
        },
      },
    },
    */
    /*
    Slider: {
      type: 'parallel',
      states: {
        PointerHandler: {
          initial: 'Inactive',
          states: {
            Inactive: {
              // XXX XXX XXX entry: raise({ type: 'SLIDE.DONE' }),
              on: {
                SLIDE: {
                  guard: 'isDragging',
                  target: 'Active',
                },
              },
            },
            Active: {
              entry: 'startDrag',
              on: {
                'POINTER.MOVE': [
                  // XXX protect move handling with isMultiTouch
                  // XXX (checking context.touches directly/synchronously)
                  // XXX in-state guard is too slow to block moves
                  {
                    guard: and(['isMultiTouch', 'isSlidingDragBusy']),
                    target: 'Sliding',
                  },
                  {
                    guard: 'isMultiTouch',
                    target: 'Done',
                  },
                  {
                    guard: 'isSliding',
                    actions: [
                      {
                        type: 'cursor',
                        params: ({ event }) => ({ ev: event.ev }),
                      },
                      {
                        type: 'moveDrag',
                        params: ({ event }) => ({ ev: event.ev }),
                      },
                      'slideScroll',
                      raise({ type: 'SLIDE.DRAG.SLIDE' }),
                    ],
                  },
                ],
                'SLIDE.DRAG.DONE': {
                  guard: not('isSlidingDragBusy'),
                  actions: ['endMove'],
                  target: 'Active',
                },
                'POINTER.UP': [
                  {
                    guard: 'isSlidingDragBusy',
                    target: 'Sliding',
                  },
                  {
                    target: 'Done',
                  },
                ],
                'DRAG.CANCEL': [
                  {
                    guard: 'isSlidingDragBusy',
                    target: 'Sliding',
                  },
                  {
                    target: 'Done',
                  },
                ],
              },
            },
            Sliding: {
              on: {
                'SLIDE.DRAG.DONE': {
                  guard: not('isSlidingDragBusy'),
                  target: 'Done',
                },
              },
            },
            Done: {
              exit: ['endMove', 'syncLayout'],
              always: 'Inactive',
            },
          },
        },
        ScrollHandler: {
          initial: 'Idle',
          states: {
            Idle: {
              on: {
                'SLIDE.DRAG.SLIDE': {
                  target: 'Busy',
                },
              },
            },
            Busy: {
              on: {
                'SCROLL.SLIDE.DONE': {
                  actions: raise({ type: 'SLIDE.DRAG.DONE' }),
                  target: 'Idle',
                },
              },
            },
          },
        },
      },
    },
    */
    /*
    Expander: {
      initial: 'Unexpanded',
      states: {
        Unexpanded: {
          // XXX XXX XXX entry: raise({ type: 'UNEXPAND.DONE' }),
          on: {
            EXPAND: {
              actions: [
                {
                  type: 'expand',
                  params: ({ context: { expand }, event: { n } }) => ({
                    n: n !== undefined ? n : expand === 1 ? EXPAND_DEFAULT : 1,
                  }),
                },
                'syncLayout',
                //'renderAndSyncScroll',
              ],
              target: 'Expanding',
            },
          },
        },
        Expanding: {
          entry: 'updateExpanding',
          on: {
            RENDERED: {
              target: 'ExpandRendering',
            },
          },
        },
        ExpandRendering: {
          entry: 'updateExpanding',
          on: {
            RENDERED: {
              actions: ['renderAndSyncScroll', 'syncViewBox', 'syncLayout'],
              target: 'ExpandRendering2',
            },
          },
        },
        ExpandRendering2: {
          entry: 'clearExpanding',
          on: {
            RENDERED: {
              target: 'Expanded',
            },
          },
        },
        Expanded: {
          entry: raise({ type: 'EXPAND.DONE' }),
          on: {
            // XXX
            // XXX
            // XXX
            'EXPAND.CANCEL': {
              actions: [
                assign({ expand: () => 1 }),
                'syncLayout',
                'renderAndSyncScroll',
              ],
              target: 'Unexpanded',
            },
            // XXX
            // XXX
            // XXX
            'LAYOUT.RESET': {
              actions: [
                assign({ expand: () => 1 }),
                'syncLayout',
                'renderAndSyncScroll',
              ],
              target: 'Unexpanded',
            },
            UNEXPAND: {
              actions: 'updateExpanding',
              target: 'Unexpanding',
            },
          },
        },
        Unexpanding: {
          on: {
            RENDERED: {
              actions: [
                'recenterLayout',
                'resetScroll',
                'endDrag',
                { type: 'expand', params: { n: 1 } },
                'syncViewBox',
                'syncLayout',
                //'renderAndSyncScroll',
              ],
              target: 'UnexpandRendering',
            },
          },
        },
        UnexpandRendering: {
          entry: 'updateExpanding',
          on: {
            RENDERED: {
              target: 'UnexpandRendering2',
            },
          },
        },
        UnexpandRendering2: {
          entry: 'clearExpanding',
          on: {
            RENDERED: {
              target: 'Unexpanded',
            },
          },
        },
      },
    },
    */
    /*
    Animator: {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            ANIMATION: {
              actions: [assign({ animating: () => true }), 'syncAnimation'],
              target: 'Busy',
            },
          },
        },
        Busy: {
          on: {
            'ANIMATION.END': {
              actions: [
                'endZoom',
                'syncLayout',
                'syncViewBox',
                'syncScrollSync',
                emit(({ context: { layout, zoom } }) => ({
                  type: 'ZOOM.END',
                  layout,
                  zoom,
                })),
                assign({ animating: () => false }),
                'syncAnimation',
                raise({ type: 'ANIMATION.DONE' }),
              ],
              target: 'Idle',
            },
          },
        },
      },
    },
    */
    /*
    PointerMonitor: {
      initial: 'Inactive',
      states: {
        Inactive: {
          on: {
            'POINTER.DOWN': {
              guard: 'isIdle',
              actions: {
                type: 'cursor',
                params: ({ event }) => ({ ev: event.ev }),
              },
              target: 'Active',
            },
          },
        },
        Active: {
          on: {
            'POINTER.MOVE': {
              target: 'Dragging',
            },
            'POINTER.UP': {
              target: 'Inactive',
            },
            // XXX CONTEXTMENU always accompanies with POINTER.MOVE
            // XXX resulting in transition to Dragging
            // XXX catch CONTEXTMENU here to avoid that
            // XXX otherwise PointerMonitor is in Dragging during PAN
            // XXX and still there after exiting PAN
            CONTEXTMENU: {
              target: 'Inactive',
            },
          },
        },
        Dragging: {
          entry: raise({ type: 'DRAG' }),
          on: {
            'POINTER.UP': [
              {
                guard: 'isSlidingDragBusy',
                target: 'Exiting',
              },
              {
                target: 'Done',
              },
            ],
            'DRAG.CANCEL': {
              target: 'Done',
            },
            'TOUCH.MOVE.DONE': {
              guard: 'isMultiTouch',
              target: 'Done',
            },
          },
        },
        Exiting: {
          on: {
            'SLIDE.DRAG.DONE': {
              target: 'Done',
            },
          },
        },
        Done: {
          exit: raise({ type: 'DRAG.DONE' }),
          always: 'Inactive',
        },
      },
    },
    */
    /*
    TouchHandler: {
      on: {
        'TOUCH.START': [
          { guard: 'isAnimating' },
          {
            actions: [
              {
                type: 'startTouches',
                params: ({ event }) => ({ ev: event.ev }),
              },
              'cursorTouches',
              raise({ type: 'TOUCH.START.DONE' }),
            ],
          },
        ],
        'TOUCH.MOVE': [
          { guard: 'isAnimating' },
          {
            actions: [
              {
                type: 'moveTouches',
                params: ({ event }) => ({ ev: event.ev }),
              },
              'cursorTouches',
              raise({ type: 'TOUCH.MOVE.DONE' }),
            ],
          },
        ],
        'TOUCH.END': {
          actions: [
            {
              type: 'endTouches',
              params: ({ event }) => ({ ev: event.ev }),
            },
            'cursorTouches',
            raise({ type: 'TOUCH.END.DONE' }),
          ],
        },
      },
    },
    TouchMonitor: {
      initial: 'Inactive',
      states: {
        Inactive: {
          // XXX XXX XXX entry: raise({ type: 'TOUCH.DONE' }),
          on: {
            'TOUCH.START.DONE': [
              {
                guard: 'isMultiTouch',
                actions: raise({ type: 'DRAG.CANCEL' }),
                target: 'Touching',
              },
            ],
            'TOUCH.MOVE.DONE': {
              guard: 'isMultiTouch',
              actions: raise({ type: 'DRAG.CANCEL' }),
              target: 'Touching',
            },
          },
        },
        Touching: {
          entry: [raise({ type: 'TOUCH' })],
          on: {
            'TOUCH.MOVE.DONE': [
              {
                guard: and(['isTouching', 'isTouchZooming']),
                actions: 'zoomTouches',
                target: 'Zooming',
              },
            ],
            'TOUCH.END.DONE': {
              guard: 'isMultiTouchEnding',
              actions: 'resetTouches',
              target: 'Inactive',
            },
            PAN: {
              target: 'Panning',
            },
          },
        },
        Zooming: {
          entry: raise({ type: 'ZOOM' }),
          on: {
            'ZOOM.DONE': [
              {
                guard: not('isMultiTouch'),
                actions: 'resetTouches',
                target: 'Inactive',
              },
              {
                actions: 'discardTouches',
                target: 'Touching',
              },
            ],
          },
        },
        Panning: {
          on: {
            'PAN.DONE': {
              actions: 'resetTouches',
              target: 'Inactive',
            },
          },
        },
      },
    },
    */
    /*
    Mover: {
      initial: 'Idle',
      states: {
        Idle: {
          // XXX XXX XXX entry: raise({ type: 'MOVE.DONE' }),
          on: {
            MOVE: {
              actions: raise({ type: 'EXPAND', n: EXPAND_DEFAULT }),
              target: 'Expanding',
            },
          },
        },
        Expanding: {
          on: {
            'EXPAND.DONE': {
              actions: ['startDrag', 'startMove'],
              target: 'Animating',
            },
            'UNEXPAND.DONE': {
              target: 'Idle',
            },
          },
        },
        Animating: {
          entry: raise({ type: 'ANIMATION' }),
          on: {
            'ANIMATION.DONE': {
              actions: [
                'recenterLayout',
                'resetScroll',
                'endDrag',

                'syncViewBox',
                'syncLayout',
                'renderAndSyncScroll',
                raise({ type: 'UNEXPAND' }),
              ],
              target: 'Expanding',
            },
          },
        },
      },
    },
    */
    /*
    Zoomer: {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            ZOOM: [
              {
                actions: [
                  'startZoom',
                  'updateZoom',
                  emit(({ context: { layout, zoom, z } }) => ({
                    type: 'ZOOM.START',
                    layout,
                    zoom,
                    z: z === null ? 0 : z,
                  })),
                ],
                target: 'Animating',
              },
            ],
          },
        },
        Animating: {
          entry: raise({ type: 'ANIMATION' }),
          on: {
            'ANIMATION.DONE': {
              actions: [
                //'recenterLayout',
                'resetScroll',
                'endDrag',
                'syncViewBox',
                'syncLayout',
                'renderAndSyncScroll',
              ],
              target: 'Rendering',
            },
          },
        },
        Rendering: {
          entry: 'updateExpanding',
          on: {
            RENDERED: {
              target: 'Rendering2',
            },
          },
        },
        Rendering2: {
          entry: 'clearExpanding',
          on: {
            RENDERED: {
              actions: raise({ type: 'ZOOM.DONE' }),
              target: 'Idle',
            },
          },
        },
      },
    },
    Dragger: {
      initial: 'Inactive',
      states: {
        Inactive: {
          on: {
            DRAG: {
              guard: 'isIdle',
              target: 'Sliding',
            },
          },
        },
        Sliding: {
          entry: raise({ type: 'SLIDE' }),
          on: {
            'SLIDE.DONE': {
              actions: [
                'recenterLayout',
                'resetScroll',
                'endDrag',
                'syncViewBox',
                'syncLayout',
                //'syncScroll',
              ],
              target: 'Inactive',
            },
          },
        },
      },
    },
    */
    Panner: {
      initial: 'None',
      states: {
        None: {
          on: {
            RESIZE: {
              actions: [
                assign({
                  rendered: () => false,
                  origLayout: ({ event }) => event.layout,
                  layout: ({ event }) => expandLayoutCenter(event.layout, 9),
                }),
              ],
              target: '#Resizing-WaitingForMapHtmlRendered',
            },
          },
        },
        Resizing: {
          initial: 'WaitingForWindowStabilized',
          onDone: 'Panning',
          states: {
            WaitingForWindowStabilized: {
              id: 'Resizing-WaitingForWindowStabilized',
              after: {
                1000: {
                  // XXX forced resize means that app is already running
                  // XXX which means MapHtml is already rendered
                  // XXX but for safety
                  target: 'WaitingForMapHtmlRendered',
                },
              },
            },
            WaitingForMapHtmlRendered: {
              id: 'Resizing-WaitingForMapHtmlRendered',
              always: {
                guard: ({ context }) => context.mapHtmlRendered,
                target: 'Layouting',
              },
            },
            Layouting: {
              entry: 'syncLayout',
              on: {
                RENDERED: {
                  actions: [
                    assign({ rendered: () => true }),
                    'syncViewBox',
                    'syncLayout',
                    'syncScrollSync',
                    'resetCursor',
                  ],
                  target: 'Done',
                },
              },
            },
            Done: { type: 'final' },
          },
        },
        /*
        Idle: {
          after: {
            250: {
              // XXX cancel this when updating/zooming?
              actions: 'unlockClick',
            },
          },
          on: {
            PAN: {
              target: 'Unexpanding',
            },
          },
        },
        Unexpanding: {
          entry: raise({ type: 'UNEXPAND' }),
          on: {
            'UNEXPAND.DONE': {
              // XXX expand to fit the whole map
              actions: raise({ type: 'EXPAND', n: EXPAND_PANNING }),
              target: 'Expanding',
            },
          },
        },
        Expanding: {
          on: {
            'EXPAND.DONE': {
              actions: [
                'setModeToPanning',
                emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
                'syncMode',
              ],
              target: 'Panning',
            },
            'UNEXPAND.DONE': {
              actions: raise({ type: 'PAN.DONE' }),
              target: 'Idle',
            },
          },
        },
        */
        // work-around - ignore click right after touchend
        // otherwise PAN mode is exited immediately
        Panning: {
          /*
          entry: 'lockClick',
          after: {
            250: {
              actions: 'unlockClick',
            },
          },
          */
          on: {
            // XXX force layout (resize)
            RESIZE: {
              actions: [
                assign({
                  rendered: () => false,
                  origLayout: ({ event }) => event.layout,
                  layout: ({ event }) => expandLayoutCenter(event.layout, 9),
                }),
              ],
              target: '#Resizing-WaitingForWindowStabilized',
            },
            'LAYOUT.RESET': {
              actions: 'zoomHome',
              target: 'Zooming',
            },
            'KEY.UP': [
              {
                guard: {
                  type: 'shouldZoom',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                actions: [
                  {
                    type: 'zoomKey',
                    params: ({ event }) => ({ ev: event.ev }),
                  },
                ],
                target: 'Zooming',
              },
            ],
            CLICK: {
              guard: not('isClickLocked'),
              actions: [
                'resetTouches',
                {
                  type: 'cursor',
                  params: ({ event }) => ({ ev: event.ev }),
                },
              ],
              target: 'Searching',
            },
            /*
            CONTEXTMENU: {
              guard: not('isClickLocked'),
              target: 'Stopping',
            },
            MODE: {
              guard: not('isClickLocked'),
              target: 'Stopping',
            },
            */
            SCROLL: {
              guard: not('isClickLocked'),
              target: 'Recentering',
            },
            'ZOOM.ZOOM': {
              actions: [
                {
                  type: 'zoomEvent',
                  params: ({ event: { z } }) => ({ z }),
                },
              ],
              target: 'Zooming',
            },
          },
        },
        Searching: {
          initial: 'Starting',
          // XXX make this conditional to scroll distance
          onDone: 'Recentering',
          states: {
            Starting: {
              always: {
                actions: [
                  emit(({ context }) => {
                    const scroll = getCurrentScroll()
                    const l =
                      scroll === null
                        ? context.layout
                        : scrollLayout(context.layout, scroll)
                    return {
                      type: 'SEARCH',
                      psvg: toSvg(context.cursor, l),
                    }
                  }),
                ],
                target: 'WaitingForSearchEnd',
              },
            },
            WaitingForSearchEnd: {
              on: {
                'SEARCH.END': {
                  actions: [
                    emit(({ context, event }) => {
                      const scroll = getCurrentScroll()
                      const l =
                        scroll === null
                          ? context.layout
                          : scrollLayout(context.layout, scroll)
                      return {
                        type: 'SEARCH.END.DONE',
                        psvg: event.res.psvg,
                        info: event.res.info,
                        layout: l,
                      }
                    }),
                  ],
                  target: 'WaitingForSearchUnlock',
                },
              },
            },
            WaitingForSearchUnlock: {
              on: {
                'SEARCH.UNLOCK': {
                  actions: [
                    'setModeToPanning',
                    emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
                    'syncMode',
                  ],
                  target: 'Done',
                },
              },
            },
            Done: { type: 'final' },
          },
        },
        // fast 'recenter'
        // - no need to involve expand
        // - because no scroll size change (== no forced reflow)
        // - getScroll()/syncScroll() must finish quickly
        // - reflect prev scroll -> current scroll diff to svg
        Recentering: {
          always: {
            actions: [
              assign({
                layout: ({ context }) => {
                  const prevScroll = context.layout.scroll
                  const scroll = getCurrentScroll()
                  return scroll === null
                    ? context.layout
                    : pipe(
                        context.layout,
                        // reflect the actuall scroll (scrollLeft/scrollTop) to layout.scroll
                        (l) => scrollLayout(l, scroll),
                        // re-center scroll & reflect the change to svg coords
                        (l) => recenterLayout(l, prevScroll)
                      )
                },
              }),
              'syncViewBox',
              'syncLayout',
              'syncScroll',
            ],
            // keep panning
            target: 'Panning',
          },
        },
        // fast zooming - no expand/unexpand + no RENDRED hack
        Zooming: {
          initial: 'Starting',
          onDone: 'Panning',
          states: {
            Starting: {
              always: {
                actions: [
                  assign({
                    layout: ({ context }) => {
                      const prevScroll = context.layout.scroll
                      const scroll = getScroll()
                      return scroll === null
                        ? context.layout
                        : pipe(
                            context.layout,
                            // reflect the actuall scroll (scrollLeft/scrollTop) to layout.scroll
                            (l) => scrollLayout(l, scroll),
                            // re-center scroll & reflect the change to svg coords
                            (l) => recenterLayout(l, prevScroll)
                          )
                    },
                  }),
                  'startZoom',
                  'updateZoom',
                  emit(({ context: { layout, zoom, z } }) => ({
                    type: 'ZOOM.START',
                    layout,
                    zoom,
                    z: z === null ? 0 : z,
                  })),
                ],
                target: 'Animating',
              },
            },
            Animating: {
              initial: 'Starting',
              onDone: 'Done',
              states: {
                Starting: {
                  always: {
                    actions: [
                      assign({ animating: () => true }),
                      'syncAnimation',
                    ],
                    target: 'Ending',
                  },
                },
                Ending: {
                  on: {
                    'ANIMATION.END': {
                      actions: [
                        'endZoom',
                        'syncLayout',
                        'syncViewBox',
                        'syncScrollSync',
                        emit(({ context: { layout, zoom } }) => ({
                          type: 'ZOOM.END',
                          layout,
                          zoom,
                        })),
                        assign({ animating: () => false }),
                        'syncAnimation',
                        raise({ type: 'ANIMATION.DONE' }),
                      ],
                      target: 'Homing',
                    },
                  },
                },
                Homing: {
                  always: [
                    {
                      guard: ({ context }) => context.homing,
                      actions: [
                        assign({
                          cursor: ({ context }) =>
                            boxCenter(context.origLayout.container),
                          layout: ({ context }) =>
                            expandLayoutCenter(context.origLayout, 9),
                          homing: () => false,
                        }),
                        'syncLayout',
                        'syncViewBox',
                        'syncScroll',
                      ],
                      target: 'Done',
                    },
                    {
                      target: 'Done',
                    },
                  ],
                },
                Done: {
                  type: 'final',
                },
              },
            },
            Done: {
              type: 'final',
            },
          },
        },
      },
    },
  },
})

//// pointerMachine
//// PointerMachine
//// PointerState
//// PointerSend

export type PointerMachine = typeof pointerMachine

export type PointerState = StateFrom<typeof pointerMachine>

export type PointerSend = (events: _PointerEvent) => void

export type PointerRef = ActorRefFrom<typeof pointerMachine>

export const selectMode = (pointer: PointerState) => pointer.context.mode
export const selectLayout = (pointer: PointerState) => pointer.context.layout
export const selectLayoutConfig = (pointer: PointerState) =>
  pointer.context.layout.config
export const selectLayoutContainer = (pointer: PointerState) =>
  pointer.context.layout.container
export const selectLayoutSvg = (pointer: PointerState) =>
  pointer.context.layout.svg
export const selectLayoutSvgScaleS = (pointer: PointerState) =>
  pointer.context.layout.svgScale.s
export const selectLayoutSvgOffset = (pointer: PointerState) =>
  pointer.context.layout.svgOffset
export const selectLayoutScroll = (pointer: PointerState) =>
  pointer.context.layout.scroll
export const selectOrigLayoutSvg = (pointer: PointerState) =>
  pointer.context.origLayout.svg
export const selectCursor = (pointer: PointerState) => pointer.context.cursor
export const selectTouches = (pointer: PointerState) => pointer.context.touches
export const selectDragging = (pointer: PointerState) =>
  pointer.context.dragging
export const selectExpanding = (pointer: PointerState) =>
  pointer.context.expanding
export const selectAnimation = (pointer: PointerState) =>
  pointer.context.animation
export const selectAnimating = (pointer: PointerState) =>
  pointer.context.animating
export const selectDebug = (pointer: PointerState) => pointer.context.debug
export const selectRendered = (pointer: PointerState) =>
  pointer.context.rendered

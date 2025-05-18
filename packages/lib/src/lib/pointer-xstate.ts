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
import { styleActor } from '../Style'
import {
  Animation,
  animationEndLayout,
  animationHome,
  animationMove,
  animationZoom,
} from './animation'
import { BoxBox, boxCenter } from './box/prefixed'
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
import { scrollMachine } from './scroll-xstate'
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
import { VecVec as Vec, vecMul, vecSub, vecVec } from './vec/prefixed'

// XXX
const DIST_LIMIT = 10

const EXPAND_DEFAULT = 3
const EXPAND_PANNING = 9

export type PointerContext = {
  origLayout: Layout
  layout: Layout
  nextLayout: null | Layout
  cursor: Vec
  expand: number
  m: null | Vec
  z: null | number
  zoom: number
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
}

type PointerExternalEvent =
  | { type: 'ANIMATION.END' }
  | { type: 'DEBUG' }
  | { type: 'LAYOUT'; layout: Layout; force: boolean }
  | { type: 'LAYOUT.RESET' }
  | { type: 'MODE'; mode: PointerMode }
  | { type: 'RENDERED' }
  | { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
  | { type: 'SCROLL.SLIDE.DONE' }
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

type UIEventClick = { type: 'CLICK'; ev: MouseEvent }
type UIEventContextMenu = { type: 'CONTEXTMENU'; ev: MouseEvent }
type UIEventKeyDown = { type: 'KEY.DOWN'; ev: KeyboardEvent }
type UIEventKeyUp = { type: 'KEY.UP'; ev: KeyboardEvent }
type UIEventPointerCancel = { type: 'POINTER.CANCEL'; ev: PointerEvent }
type UIEventPointerDown = { type: 'POINTER.DOWN'; ev: PointerEvent }
type UIEventPointerMove = { type: 'POINTER.MOVE'; ev: PointerEvent }
type UIEventPointerUp = { type: 'POINTER.UP'; ev: PointerEvent }
type UIEventScroll = { type: 'SCROLL'; ev: Event }
type UIEventTouchCancel = { type: 'TOUCH.CANCEL'; ev: TouchEvent }
type UIEventTouchEnd = { type: 'TOUCH.END'; ev: TouchEvent }
type UIEventTouchMove = { type: 'TOUCH.MOVE'; ev: TouchEvent }
type UIEventTouchStart = { type: 'TOUCH.START'; ev: TouchEvent }
type UIEventWheel = { type: 'WHEEL'; ev: WheelEvent }

export type ReactUIEvent =
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
    syncScroll: ({ context: { layout }, system }): void => {
      system.get('scroll1').send({
        type: 'SYNC',
        pos: layout.scroll,
      })
    },
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
      z: (_, { ev }: { ev: WheelEvent }): number => (ev.deltaY < 0 ? 1 : -1),
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
    syncMatrix: ({ context: { layout } }) => {
      styleActor.send({ type: 'STYLE.LAYOUT', layout })
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
        { context: { mode, cursor } },
        { ev }: { ev: MouseEvent | PointerEvent }
      ): Vec => (mode !== 'pointing' ? cursor : vecVec(ev.pageX, ev.pageY)),
    }),

    //
    // drag
    //
    startDrag: assign({
      drag: ({ context: { layout, cursor } }): Drag =>
        dragStart(layout.scroll, cursor),
    }),
    moveDrag: assign({
      drag: (
        { context: { drag } },
        { ev }: { ev: PointerEvent }
      ): null | Drag =>
        drag === null ? null : dragMove(drag, vecVec(ev.pageX, ev.pageY)),
    }),
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
      touches: ({ context: { touches } }, { ev }: { ev: TouchEvent }) =>
        handleTouchStart(touches, ev),
    }),
    moveTouches: assign({
      touches: ({ context: { touches } }, { ev }: { ev: TouchEvent }) =>
        handleTouchMove(touches, ev, DIST_LIMIT),
    }),
    endTouches: assign({
      touches: ({ context: { touches } }, { ev }: { ev: TouchEvent }) =>
        handleTouchEnd(touches, ev),
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
    resetMode: assign({ mode: 'pointing' }),
    setModeToPanning: assign({
      mode: 'panning',
      // XXX resetCursor
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
    setModeToLocked: assign({
      mode: ({ context: { mode } }) => (mode === 'pointing' ? 'locked' : mode),
    }),

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
    touches: resetTouches(),
    drag: null,
    animation: null,
    debug: false,
    mode: 'pointing',
    clickLock: false,
    dragging: false,
    expanding: 0,
    animating: false,
    rendered: false,
  },
  invoke: [
    {
      src: 'scroll',
      systemId: 'scroll1',
    },
  ],
  states: {
    Pointer: {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            LAYOUT: [
              /* XXX force layout (resize) */
              {
                guard: ({ event }) => event.force,
                actions: assign({
                  origLayout: ({ event }) => event.layout,
                  layout: ({ event }) => event.layout,
                  cursor: ({ event }) => boxCenter(event.layout.container),
                }),
                target: 'Resizing',
              },
              {
                actions: assign({
                  origLayout: ({ event }) => event.layout,
                  layout: ({ event }) => event.layout,
                  cursor: ({ event }) => boxCenter(event.layout.container),
                }),
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
          initial: 'Assigned',
          onDone: 'Idle',
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
                  ],
                },
              },
            },
            Done: {
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
                  actions: 'resetScroll',
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
              ],
              target: 'Idle',
            },
          },
        },
      },
    },
    Slider: {
      type: 'parallel',
      states: {
        PointerHandler: {
          initial: 'Inactive',
          states: {
            Inactive: {
              entry: raise({ type: 'SLIDE.DONE' }),
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
                  actions: 'endMove',
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
              exit: 'endMove',
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
    Expander: {
      initial: 'Unexpanded',
      states: {
        Unexpanded: {
          entry: raise({ type: 'UNEXPAND.DONE' }),
          on: {
            EXPAND: {
              actions: [
                {
                  type: 'expand',
                  params: ({ context: { expand }, event: { n } }) => ({
                    n: n !== undefined ? n : expand === 1 ? EXPAND_DEFAULT : 1,
                  }),
                },
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
              actions: ['syncScroll', 'syncViewBox', 'syncMatrix'],
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
              actions: assign({ expand: () => 1 }),
              target: 'Unexpanded',
            },
            // XXX
            // XXX
            // XXX
            'LAYOUT.RESET': {
              actions: assign({ expand: () => 1 }),
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
                'syncMatrix',
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
    Animator: {
      initial: 'Idle',
      states: {
        Idle: {
          entry: raise({ type: 'ANIMATION.DONE' }),
          on: {
            ANIMATION: {
              actions: assign({ animating: () => true }),
              target: 'Busy',
            },
          },
        },
        Busy: {
          on: {
            'ANIMATION.END': {
              actions: [
                'endZoom',
                emit(({ context: { layout, zoom } }) => ({
                  type: 'ZOOM.END',
                  layout,
                  zoom,
                })),
                assign({ animating: () => false }),
              ],
              target: 'Idle',
            },
          },
        },
      },
    },
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
          entry: raise({ type: 'TOUCH.DONE' }),
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
    Mover: {
      initial: 'Idle',
      states: {
        Idle: {
          entry: raise({ type: 'MOVE.DONE' }),
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
                'syncMatrix',
                raise({ type: 'UNEXPAND' }),
              ],
              target: 'Expanding',
            },
          },
        },
      },
    },
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
              actions: ['resetScroll', 'syncViewBox', 'syncMatrix'],
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
                'syncViewBox',
                'syncMatrix',
              ],
              target: 'Inactive',
            },
          },
        },
      },
    },
    Panner: {
      initial: 'Idle',
      states: {
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
            'PAN.ZOOM.ZOOM': {
              target: 'Zooming',
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
              ],
              target: 'Panning',
            },
            'UNEXPAND.DONE': {
              actions: raise({ type: 'PAN.DONE' }),
              target: 'Idle',
            },
          },
        },
        // work-around - ignore click right after touchend
        // otherwise PAN mode is exited immediately
        Panning: {
          entry: 'lockClick',
          after: {
            250: {
              actions: 'unlockClick',
            },
          },
          on: {
            LAYOUT: {
              actions: assign({
                layout: ({ event }) => event.layout,
                cursor: ({ event }) => boxCenter(event.layout.container),
              }),
              target: 'Stopping',
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
                  raise({ type: 'PAN.ZOOM' }),
                ],
                target: 'Stopping',
              },
            ],
            CLICK: {
              guard: not('isClickLocked'),
              target: 'Stopping',
            },
            CONTEXTMENU: {
              guard: not('isClickLocked'),
              target: 'Stopping',
            },
            MODE: {
              guard: not('isClickLocked'),
              target: 'Stopping',
            },
            SCROLL: {
              guard: not('isClickLocked'),
              target: 'Updating',
            },
            'ZOOM.ZOOM': {
              actions: [
                {
                  type: 'zoomEvent',
                  params: ({ event: { z } }) => ({ z }),
                },
                raise({ type: 'PAN.ZOOM' }),
              ],
              target: 'Stopping',
            },
          },
        },
        Updating: {
          exit: raise({ type: 'PAN.UPDATE' }),
          always: 'Stopping',
        },
        Stopping: {
          entry: [
            'lockClick',
            'resetMode',
            emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
            'getScroll',
          ],
          on: {
            'SCROLL.GET.DONE': {
              actions: [
                {
                  type: 'scrollLayout',
                  params: ({ event: { scroll } }) => ({ scroll }),
                },
                'resetScroll',
                'syncViewBox',
                'syncMatrix',
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
              actions: raise({ type: 'PAN.DONE' }),
              target: 'Idle', // XXX Idle will receive PAN.ZOOM.ZOOM
            },
          },
        },
        Zooming: {
          entry: raise({ type: 'ZOOM' }),
          on: {
            'ZOOM.DONE': {
              actions: raise({ type: 'PAN.ZOOM.ZOOM.DONE' }),
              target: 'Idle',
            },
          },
        },
      },
    },
    Locker: {
      on: {
        'SEARCH.LOCK': [
          {
            guard: 'isIdle',
            actions: [
              emit({ type: 'LOCK', ok: true }),
              'setModeToLocked',
              emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
            ],
          },
          {
            actions: emit({ type: 'LOCK', ok: false }),
          },
        ],
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

export type PointerMode = 'pointing' | 'panning' | 'locked'

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

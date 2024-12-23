import { RefObject } from 'react'
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

export type PointerInput = {
  layout: Layout
  containerRef: RefObject<HTMLDivElement>
}

export type PointerContext = {
  containerRef: RefObject<HTMLDivElement>
  layout: Layout
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
}

type PointerExternalEvent =
  | { type: 'LAYOUT'; layout: Layout }
  | { type: 'LAYOUT.RESET' }
  | { type: 'DEBUG' }
  | { type: 'MODE'; mode: PointerMode }
  | { type: 'RENDERED' }
  | { type: 'ANIMATION.END' }
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
  | { type: 'EXPAND.DONE' }
  | { type: 'EXPAND.EXPANDED' }
  | { type: 'EXPAND.RENDERED' }
  | { type: 'UNEXPAND' }
  | { type: 'UNEXPAND.DONE' }
  | { type: 'UNEXPAND.UNEXPANDED' }
  | { type: 'UNEXPAND.RENDERED' }
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
  | { type: 'SEARCH'; p: Vec; psvg: Vec }
  | { type: 'SEARCH.LOCK'; p: Vec; psvg: Vec }
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

export type PointerDOMEvent =
  | MouseEvent
  | WheelEvent
  | PointerEvent
  | TouchEvent
  | KeyboardEvent

type PointerEventClick = { type: 'CLICK'; ev: MouseEvent }
type PointerEventContextMenu = { type: 'CONTEXTMENU'; ev: MouseEvent }
type PointerEventWheel = { type: 'WHEEL'; ev: WheelEvent }
type PointerEventKeyDown = { type: 'KEY.DOWN'; ev: KeyboardEvent }
type PointerEventKeyUp = { type: 'KEY.UP'; ev: KeyboardEvent }
type PointerEventPointerDown = { type: 'POINTER.DOWN'; ev: PointerEvent }
type PointerEventPointerMove = { type: 'POINTER.MOVE'; ev: PointerEvent }
type PointerEventPointerUp = { type: 'POINTER.UP'; ev: PointerEvent }
type PointerEventPointerCancel = { type: 'POINTER.CANCEL'; ev: PointerEvent }
type PointerEventTouchStart = { type: 'TOUCH.START'; ev: TouchEvent }
type PointerEventTouchMove = { type: 'TOUCH.MOVE'; ev: TouchEvent }
type PointerEventTouchEnd = { type: 'TOUCH.END'; ev: TouchEvent }
type PointerEventTouchCancel = { type: 'TOUCH.CANCEL'; ev: TouchEvent }
type PointerEventScroll = { type: 'SCROLL'; ev: Event }

export type ReactPointerEvent =
  | PointerEventClick
  | PointerEventContextMenu
  | PointerEventWheel
  | PointerEventPointerDown
  | PointerEventPointerMove
  | PointerEventPointerUp
  | PointerEventPointerCancel
  | PointerEventTouchStart
  | PointerEventTouchMove
  | PointerEventTouchEnd
  | PointerEventTouchCancel
  | PointerEventScroll

export type PointerPointerEvent =
  | ReactPointerEvent
  | PointerEventKeyDown
  | PointerEventKeyUp

export type _PointerEvent =
  | PointerExternalEvent
  | PointerInternalEvent
  | PointerPointerEvent

export type PointerEmitted =
  | { type: 'SEARCH'; p: Vec; psvg: Vec }
  | { type: 'LOCK'; ok: boolean }
  | { type: 'LAYOUT'; layout: Layout }
  | { type: 'ZOOM.START'; layout: Layout; zoom: number; z: number }
  | { type: 'ZOOM.END'; layout: Layout; zoom: number }

//// pointerMachine

export const pointerMachine = setup({
  types: {} as {
    input: PointerInput
    context: PointerContext
    events: _PointerEvent
    emitted: PointerEmitted
  },
  guards: {
    shouldDebug: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'd',
    shouldReset: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'r',
    shouldZoom: (_, { ev }: { ev: KeyboardEvent }) => keyToZoom(ev.key) !== 0,
    shouldExpand: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'e',
    shouldMove: (_, { ev }: { ev: KeyboardEvent }) =>
      'hjkl'.indexOf(ev.key) >= 0,
    shouldPan: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'm',
    isMultiTouch: ({ context: { touches } }) => isMultiTouch(touches),
    isMultiTouchEnding: ({ context: { touches } }) =>
      isMultiTouchEnding(touches),
    isExpanded: ({ context }) => context.expand !== 1,
    isTouchZooming: ({ context }) => context.touches.z !== null,
    isTouchHorizontal: ({ context }) => context.touches.horizontal === true,
    isMoving: ({ context: { animation } }) =>
      animation !== null && animation.move !== null,
    isZooming: ({ context: { animation } }) =>
      animation !== null && animation.zoom !== null,
    isZoomingIn: ({ context: { z } }) => z !== null && z > 0,
    isAnimating: ({ context: { animation } }) => animation !== null,
    isClickLocked: ({ context: { clickLock } }) => clickLock,
    idle: and([
      stateIn({ Pointer: 'Idle' }),
      stateIn({ Dragger: 'Inactive' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    dragging: and([
      stateIn({ Pointer: 'Dragging.Active' }),
      stateIn({ Dragger: 'Sliding' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    sliding: and([
      stateIn({ Pointer: 'Dragging.Active' }),
      stateIn({ Dragger: 'Sliding' }),
      stateIn({ Slider: { PointerHandler: 'Active' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    slidingDragBusy: and([
      stateIn({ Pointer: 'Dragging.Active' }),
      stateIn({ Dragger: 'Sliding' }),
      stateIn({ Slider: { PointerHandler: 'Active' } }),
      stateIn({ Slider: { ScrollHandler: 'Busy' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    touching: and([
      stateIn({ Pointer: { Dragging: 'Touching' } }),
      stateIn({ Dragger: 'Inactive' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Idle' }),
    ]),
    panning: and([
      stateIn({ Pointer: { Dragging: 'Panning' } }),
      stateIn({ Dragger: 'Inactive' }),
      stateIn({ Slider: { PointerHandler: 'Inactive' } }),
      stateIn({ Animator: 'Idle' }),
      stateIn({ Panner: 'Panning' }),
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
    endAnimation: assign({
      layout: ({ context: { layout, animation } }): Layout =>
        animation === null ? layout : animationEndLayout(layout, animation),
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
    setModeToLocked: assign({ mode: 'locked' }),
    lockClick: assign({ clickLock: true }),
    unlockClick: assign({ clickLock: false }),
  },
  actors: {
    scroll: scrollMachine,
  },
}).createMachine({
  type: 'parallel',
  id: 'pointer',
  context: ({ input: { layout, containerRef } }) => ({
    containerRef,
    layout,
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
  }),
  invoke: [
    {
      src: 'scroll',
      systemId: 'scroll1',
      input: ({ context, self }) => ({
        parent: self,
        ref: context.containerRef,
      }),
    },
  ],
  states: {
    Pointer: {
      initial: 'Idle',
      states: {
        Idle: {
          on: {
            LAYOUT: {
              actions: assign({
                layout: ({ event }) => event.layout,
                cursor: ({ event }) => boxCenter(event.layout.container),
              }),
            },
            'LAYOUT.RESET': {
              guard: 'idle',
              actions: 'zoomHome',
              target: 'Homing',
            },
            MODE: [
              {
                target: 'Panning',
              },
            ],
            'ZOOM.ZOOM': {
              guard: 'idle',
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
                guard: not('idle'),
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
                  type: 'shouldExpand',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                target: 'Expanding',
              },
              {
                guard: {
                  type: 'shouldPan',
                  params: ({ event }) => ({ ev: event.ev }),
                },
                target: 'Panning',
              },
              {
                guard: not('idle'),
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
                  p: cursor,
                  psvg: toSvg(cursor, layout),
                })),
              ],
              target: 'Idle',
            },
            CONTEXTMENU: {
              guard: not('isClickLocked'),
              target: 'Panning',
            },
            WHEEL: {
              guard: 'idle',
              actions: [
                { type: 'cursor', params: ({ event }) => ({ ev: event.ev }) },
                {
                  type: 'zoomWheel',
                  params: ({ event }) => ({ ev: event.ev }),
                },
              ],
              target: 'Zooming',
            },
            'POINTER.DOWN': {
              actions: {
                type: 'cursor',
                params: ({ event }) => ({ ev: event.ev }),
              },
            },
            DRAG: {
              guard: 'idle',
              target: 'Dragging.Active',
            },
            TOUCH: [
              {
                guard: not('idle'),
              },
              {
                guard: 'isTouchHorizontal',
                target: 'Panning',
              },
              {
                target: 'Touching',
              },
            ],
            'SEARCH.LOCK': [
              {
                guard: not('idle'),
              },
              {
                target: 'Locked',
              },
            ],
          },
        },
        Expanding: {
          initial: 'Checking',
          onDone: 'Idle',
          states: {
            Checking: {
              always: [
                {
                  guard: not('isExpanded'),
                  actions: raise({ type: 'EXPAND' }),
                  target: 'Expanding',
                },
                {
                  actions: raise({ type: 'UNEXPAND' }),
                  target: 'Expanding',
                },
              ],
            },
            Expanding: {
              on: {
                'EXPAND.DONE': {
                  target: 'Done',
                },
                'UNEXPAND.DONE': {
                  target: 'Done',
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
              on: {
                TOUCH: { target: 'WaitingForDragDone' },
                'DRAG.DONE': { target: 'Exiting' },
              },
            },
            Exiting: {
              on: {
                CLICK: { target: 'Done' },
                'TOUCH.END': { target: 'Done' },
              },
            },
            WaitingForDragDone: {
              on: {
                'DRAG.DONE': {
                  target: 'WaitingForUnexpandDone',
                },
              },
            },
            WaitingForUnexpandDone: {
              on: {
                'UNEXPAND.DONE': [
                  {
                    guard: 'isTouchHorizontal',
                    target: '#pointer-panning',
                  },
                  {
                    target: '#pointer-touching',
                  },
                ],
              },
            },
            Done: {
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
                  target: 'Done',
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
              entry: raise({ type: 'PAN.ZOOM.ZOOM' }, { delay: 1 }),
              on: {
                'PAN.ZOOM.ZOOM.DONE': {
                  target: 'Active',
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
          entry: raise({ type: 'ZOOM' }),
          on: {
            'ZOOM.DONE': {
              target: 'Idle',
            },
          },
        },
        Homing: {
          entry: raise({ type: 'ZOOM' }),
          exit: [
            'resetLayout',
            'resetCursor',
            emit(({ context: { layout } }) => ({ type: 'LAYOUT', layout })),
          ],
          on: {
            'ZOOM.DONE': {
              target: 'Idle',
            },
          },
        },
        Locked: {
          on: {
            'SEARCH.UNLOCK': {
              actions: 'resetMode',
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
                  guard: 'dragging',
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
                    guard: and(['isMultiTouch', 'slidingDragBusy']),
                    target: 'Sliding',
                  },
                  {
                    guard: 'isMultiTouch',
                    target: 'Done',
                  },
                  {
                    guard: 'sliding',
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
                  guard: not('slidingDragBusy'),
                  actions: 'endMove',
                  target: 'Active',
                },
                'POINTER.UP': [
                  {
                    guard: 'slidingDragBusy',
                    target: 'Sliding',
                  },
                  {
                    target: 'Done',
                  },
                ],
                'DRAG.CANCEL': [
                  {
                    guard: 'slidingDragBusy',
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
                  guard: not('slidingDragBusy'),
                  target: 'Done',
                },
              },
            },
            Done: {
              entry: 'endMove',
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
              actions: {
                type: 'expand',
                params: ({ context: { expand }, event: { n } }) => ({
                  n: n !== undefined ? n : expand === 1 ? EXPAND_DEFAULT : 1,
                }),
              },
              target: 'Expanding',
            },
          },
        },
        Expanding: {
          tags: ['rendering'],
          on: {
            RENDERED: {
              target: 'ExpandRendering',
            },
          },
        },
        ExpandRendering: {
          tags: ['rendering'],
          on: {
            RENDERED: {
              actions: 'syncScroll',
              target: 'Expanded',
            },
          },
        },
        Expanded: {
          entry: raise({ type: 'EXPAND.DONE' }),
          on: {
            UNEXPAND: {
              target: 'Unexpanding',
            },
          },
        },
        Unexpanding: {
          tags: ['rendering'],
          on: {
            RENDERED: {
              actions: [
                'recenterLayout',
                'resetScroll',
                'endDrag',
                { type: 'expand', params: { n: 1 } },
              ],
              target: 'UnexpandRendering',
            },
          },
        },
        UnexpandRendering: {
          tags: ['rendering'],
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
              target: 'Busy',
            },
          },
        },
        Busy: {
          on: {
            'ANIMATION.END': {
              actions: [
                'endAnimation',
                emit(({ context: { layout, zoom } }) => ({
                  type: 'ZOOM.END',
                  layout,
                  zoom,
                })),
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
              guard: 'idle',
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
            'TOUCH.START.DONE': {
              guard: 'isTouchHorizontal',
              target: 'Inactive',
            },
          },
        },
        Dragging: {
          entry: raise({ type: 'DRAG' }),
          exit: raise({ type: 'DRAG.DONE' }),
          on: {
            'POINTER.UP': {
              target: 'Inactive',
            },
            'DRAG.CANCEL': {
              target: 'Inactive',
            },
            'TOUCH.MOVE.DONE': {
              guard: 'isMultiTouch',
              target: 'Inactive',
            },
          },
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
                guard: and(['touching', 'isTouchZooming']),
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
              actions: raise({ type: 'EXPAND', n: 3 }),
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
          entry: raise({ type: 'ZOOM.DONE' }),
          on: {
            ZOOM: [
              {
                guard: not('isZoomingIn'),
                // XXX consider zoom factor
                actions: raise({ type: 'EXPAND', n: 3 }),
                target: 'Expanding',
              },
              {
                guard: 'isZoomingIn',
                actions: raise({ type: 'EXPAND', n: 1 }),
                target: 'Expanding',
              },
            ],
          },
        },
        Expanding: {
          on: {
            'EXPAND.DONE': {
              actions: [
                'startZoom',
                emit(({ context: { layout, zoom, z } }) => ({
                  type: 'ZOOM.START',
                  layout,
                  zoom,
                  z: z === null ? 0 : z,
                })),
              ],
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
              actions: raise({ type: 'UNEXPAND' }),
              target: 'Expanding',
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
              guard: 'idle',
              actions: raise({ type: 'EXPAND', n: 3 }),
              target: 'Expanding',
            },
          },
        },
        Expanding: {
          on: {
            'EXPAND.DONE': {
              target: 'Sliding',
            },
            'UNEXPAND.DONE': {
              target: 'Inactive',
            },
          },
        },
        Sliding: {
          entry: raise({ type: 'SLIDE' }),
          on: {
            'SLIDE.DONE': {
              actions: raise({ type: 'UNEXPAND' }),
              target: 'Expanding',
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
              // XXX expand to fit the whole map
              actions: raise({ type: 'EXPAND', n: EXPAND_PANNING }),
              target: 'Expanding',
            },
            'PAN.ZOOM.ZOOM': {
              target: 'Zooming',
            },
          },
        },
        Expanding: {
          on: {
            'EXPAND.DONE': {
              actions: 'setModeToPanning',
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
          entry: ['lockClick', 'resetMode', 'getScroll'],
          on: {
            'SCROLL.GET.DONE': {
              actions: [
                {
                  type: 'scrollLayout',
                  params: ({ event: { scroll } }) => ({ scroll }),
                },
                raise({ type: 'UNEXPAND' }),
              ],
              target: 'Expanding',
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
            guard: 'idle',
            actions: [
              emit({ type: 'LOCK', ok: true }),
              assign({
                mode: ({ context: { mode } }) =>
                  mode === 'pointing' ? 'locked' : mode,
              }),
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
export const selectCursor = (pointer: PointerState) => pointer.context.cursor
export const selectTouches = (pointer: PointerState) => pointer.context.touches

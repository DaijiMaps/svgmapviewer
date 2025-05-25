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
import { VecVec as Vec, vecMul, vecSub, VecVec, vecVec } from './vec/prefixed'

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
type PointerModeTouching = 'touching'
type PointerModeLocked = 'locked'
export type PointerMode =
  | PointerModePointing
  | PointerModePanning
  | PointerModeTouching
  | PointerModeLocked
export const pointerModePointing: PointerModePointing = 'pointing'
export const pointerModePanning: PointerModePanning = 'panning'
export const pointerModeTouching: PointerModeTouching = 'touching'
export const pointerModeLocked: PointerModeLocked = 'locked'

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
  | { type: 'TOUCH.LOCK' }
  | { type: 'TOUCH.UNLOCK' }
  | { type: 'ZOOM.ZOOM'; z: -1 | 1; p: null | VecVec }

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
    zoomHome: assign({
      z: (): null | number => null,
      zoom: () => 1,
      homing: () => true,
    }),
    zoomEvent: assign({
      z: (_, { z }: { z: -1 | 1; p: null | Vec }): number => z,
      cursor: (
        { context: { cursor } },
        { p }: { z: -1 | 1; p: null | Vec }
      ): Vec => (p === null ? cursor : p),
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
    // mode
    //
    resetMode: assign({ mode: pointerModePointing }),
    setModeToPanning: assign({
      mode: pointerModePanning,
      // XXX resetCursor
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
    setModeToTouching: assign({
      mode: pointerModeTouching,
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
    Panner: {
      initial: 'Resizing',
      states: {
        Resizing: {
          initial: 'WaitingForResizeEvent',
          onDone: 'Panning',
          states: {
            WaitingForResizeEvent: {
              on: {
                RESIZE: {
                  actions: [
                    assign({
                      rendered: () => false,
                      origLayout: ({ event }) => event.layout,
                      layout: ({ event }) =>
                        expandLayoutCenter(event.layout, 9),
                    }),
                  ],
                  target: 'WaitingForMapHtmlRendered',
                },
              },
            },
            WaitingForWindowStabilized: {
              id: 'Resizing-WaitingForWindowStabilized',
              after: {
                500: {
                  // XXX forced resize means that app is already running
                  // XXX which means MapHtml is already rendered
                  // XXX but for safety
                  target: 'WaitingForMapHtmlRendered',
                },
              },
            },
            WaitingForMapHtmlRendered: {
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
                    // slow sync - sync scroll after resize
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
        // work-around - ignore click right after touchend
        // otherwise PAN mode is exited immediately
        Panning: {
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
            CONTEXTMENU: {
              guard: not('isClickLocked'),
              target: 'Recentering',
            },
            /*
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
                  params: ({ event: { z, p } }) => ({ z, p }),
                },
              ],
              target: 'Zooming',
            },
            'TOUCH.LOCK': {
              actions: [
                'setModeToTouching',
                emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
              ],
              target: 'Touching',
            },
          },
        },
        Touching: {
          on: {
            'TOUCH.UNLOCK': {
              actions: [
                'setModeToPanning',
                emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
              ],
              target: 'Panning',
            },
            'ZOOM.ZOOM': {
              actions: [
                'setModeToPanning',
                {
                  type: 'zoomEvent',
                  params: ({ event: { z, p } }) => ({ z, p }),
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
              // fast sync - sync scroll NOT after resize
              'syncScroll',
            ],
            // keep panning
            target: 'Panning',
          },
        },
        // fast zooming - no expand/unexpand + no RENDRED hack
        Zooming: {
          initial: 'Stopping',
          onDone: 'Panning',
          states: {
            // XXX
            // XXX stop scroll before really start zooming
            // XXX otherwise a gap occurs between zoom & layout result
            // XXX
            Stopping: {
              entry: 'getScroll',
              on: {
                'SCROLL.GET.DONE': {
                  target: 'Rendering',
                },
              },
            },
            Rendering: {
              after: {
                // XXX
                // XXX
                // XXX
                20: {
                  target: 'Starting',
                },
                // XXX
                // XXX
                // XXX
              },
            },
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
                        // fast sync - sync scroll NOT after resize
                        'syncScroll',
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
                        // fast sync - sync scroll NOT after resize
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

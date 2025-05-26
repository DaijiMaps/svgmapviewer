import { useSelector } from '@xstate/react'
import React from 'react'
import {
  type ActorRefFrom,
  assign,
  createActor,
  emit,
  enqueueActions,
  setup,
  type StateFrom,
} from 'xstate'
import {
  type Animation,
  animationEndLayout,
  animationHome,
  animationZoom,
} from './animation'
import { type BoxBox, boxCenter } from './box/prefixed'
import { registerCbs } from './config'
import {
  configSend,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyZoomEnd,
  notifyZoomStart,
} from './config-xstate'
import { scrollTimeoutActorSend } from './event-xstate'
import { keyToZoom } from './key'
import {
  emptyLayout,
  expandLayoutCenter,
  type Layout,
  makeLayout,
  scrollLayout,
  toSvg,
} from './layout'
import { getCurrentScroll } from './scroll'
import { styleSend } from './style-xstate'
import { syncViewBox } from './svg'
import { type Info, type SearchRes } from './types'
import { type VecVec as Vec, type VecVec, vecVec } from './vec/prefixed'

const EXPAND_PANNING = 9

type PointerModePanning = 'panning'
type PointerModeTouching = 'touching'
type PointerModeLocked = 'locked'
export type PointerMode =
  | PointerModePanning
  | PointerModeTouching
  | PointerModeLocked
export const pointerModePanning: PointerModePanning = 'panning'
export const pointerModeTouching: PointerModeTouching = 'touching'
export const pointerModeLocked: PointerModeLocked = 'locked'

export type PointerContext = {
  origLayout: Layout
  layout: Layout
  nextLayout: null | Layout
  cursor: Vec
  z: null | number
  zoom: number
  animation: null | Animation

  mode: PointerMode
  touching: boolean

  homing: boolean
  animating: boolean // XXX
  rendered: boolean
  mapHtmlRendered: boolean
}

type PointerExternalEvent =
  | { type: 'RESIZE'; layout: Layout; force: boolean }
  | { type: 'LAYOUT.RESET' }
  | { type: 'RENDERED' }
  | { type: 'RENDERED.MAP-HTML' }
  | { type: 'ANIMATION.END' }
  | { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
  | { type: 'SCROLL.SYNCSYNC.DONE'; scroll: BoxBox }
  | { type: 'TOUCH.LOCK' }
  | { type: 'TOUCH.UNLOCK' }
  | { type: 'ZOOM.ZOOM'; z: -1 | 1; p: null | VecVec }

type PointerEventSearch =
  | { type: 'SEARCH.END'; res: Readonly<SearchRes> }
  | { type: 'SEARCH.LOCK'; psvg: Vec }
  | { type: 'SEARCH.UNLOCK' }

type PointerEventTouching = { type: 'TOUCHING' } | { type: 'TOUCHING.DONE' }

type PointerInternalEvent = PointerEventSearch | PointerEventTouching

type UIEventClick = { type: 'CLICK'; ev: React.MouseEvent<HTMLDivElement> }
type UIEventContextMenu = {
  type: 'CONTEXTMENU'
  ev: React.MouseEvent<HTMLDivElement>
}
type UIEventKeyDown = { type: 'KEY.DOWN'; ev: KeyboardEvent }
type UIEventKeyUp = { type: 'KEY.UP'; ev: KeyboardEvent }
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
  | UIEventScroll
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

const pointerMachine = setup({
  types: {} as {
    context: PointerContext
    events: _PointerEvent
    emitted: PointerEmitted
  },
  guards: {
    // key
    shouldReset: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'r',
    shouldZoom: (_, { ev }: { ev: KeyboardEvent }) => keyToZoom(ev.key) !== 0,
    isTouching: ({ context: { touching } }) => touching,
  },
  actions: {
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
    getScroll: ({ system }): void => {
      system.get('scroll1').send({
        type: 'GET',
      })
    },

    //
    // move + zoom
    //
    zoomKey: assign({
      z: (_, { ev }: { ev: KeyboardEvent }): number => keyToZoom(ev.key),
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
    syncAnimation: ({ context: { animation } }) =>
      styleSend({ type: 'STYLE.ANIMATION', animation }),
    //
    // layout
    //
    scrollLayout: assign({
      layout: (
        { context: { layout } },
        { scroll }: { scroll: BoxBox }
      ): Layout => scrollLayout(layout, scroll),
    }),
    syncViewBox: ({ context: { layout } }) =>
      // XXX
      // XXX
      // XXX
      syncViewBox('.container > .content.svg > svg', layout.svg),
    // XXX
    // XXX
    // XXX
    syncLayout: ({ context: { layout, rendered } }) => {
      styleSend({ type: 'STYLE.LAYOUT', layout, rendered })
      configSend({ type: 'CONFIG.LAYOUT', layout, force: false })
    },

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
    // mode
    //
    setModeToPanning: assign({
      mode: pointerModePanning,
      // XXX resetCursor
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
    setModeToTouching: assign({
      mode: pointerModeTouching,
    }),
    setModeToLocked: assign({
      mode: pointerModeLocked,
    }),
    syncMode: ({ context: { mode } }) =>
      styleSend({ type: 'STYLE.MODE', mode }),
    touchStart: enqueueActions(({ enqueue }) => {
      enqueue.assign({ touching: true })
      enqueue.raise({ type: 'TOUCHING' })
    }),
    touchEnd: enqueueActions(({ enqueue }) => {
      enqueue.assign({ touching: false })
      enqueue.raise({ type: 'TOUCHING.DONE' })
    }),
  },
  actors: {
    //scroll: scrollMachine,
  },
}).createMachine({
  id: 'pointer',
  initial: 'Resizing',
  context: {
    origLayout: emptyLayout,
    layout: emptyLayout,
    nextLayout: null,
    cursor: boxCenter(emptyLayout.container),
    z: null,
    zoom: 1,
    homing: false,
    animation: null,
    mode: pointerModePanning,
    touching: false,
    animating: false,
    rendered: false,
    mapHtmlRendered: false,
  },
  invoke: [
    /*
    {
      src: 'scroll',
      systemId: 'scroll1',
    },
    */
  ],
  on: {
    RENDERED: {},
    'RENDERED.MAP-HTML': {
      actions: assign({
        mapHtmlRendered: true,
      }),
    },
    'TOUCH.LOCK': {
      actions: [
        'touchStart',
        'setModeToTouching',
        emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
        'syncMode',
      ],
    },
    'TOUCH.UNLOCK': {
      actions: [
        'touchEnd',
        'setModeToPanning',
        emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
        'syncMode',
      ],
    },
    'SEARCH.LOCK': {
      // XXX failure?
      actions: [
        emit({ type: 'LOCK', ok: true }),
        'setModeToLocked',
        emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
        'syncMode',
      ],
    },
    'SEARCH.UNLOCK': {
      actions: [
        'setModeToPanning',
        emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
        'syncMode',
      ],
    },
  },
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
                  rendered: false,
                  origLayout: ({ event }) => event.layout,
                  layout: ({ event }) =>
                    expandLayoutCenter(event.layout, EXPAND_PANNING),
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
                assign({ rendered: true }),
                'syncViewBox',
                'syncLayout',
                'resetCursor',
              ],
              target: 'Syncing',
            },
          },
        },
        Syncing: {
          // slow sync - sync scroll after resize
          entry: 'syncScrollSync',
          on: {
            'SCROLL.SYNCSYNC.DONE': {
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
              rendered: false,
              origLayout: ({ event }) => event.layout,
              layout: ({ event }) =>
                expandLayoutCenter(event.layout, EXPAND_PANNING),
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
          actions: [
            {
              type: 'cursor',
              params: ({ event }) => ({ ev: event.ev }),
            },
          ],
          target: 'Searching',
        },
        CONTEXTMENU: {
          target: 'Recentering',
        },
        SCROLL: {
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
        TOUCHING: {
          target: 'Touching',
        },
      },
    },
    Touching: {
      initial: 'Stopping',
      onDone: 'Panning',
      states: {
        Stopping: {
          entry: 'getScroll',
          on: {
            'SCROLL.GET.DONE': {
              target: 'Waiting',
            },
          },
        },
        Waiting: {
          on: {
            'TOUCHING.DONE': {
              target: 'Done',
            },
            'ZOOM.ZOOM': {
              actions: [
                {
                  type: 'zoomEvent',
                  params: ({ event: { z, p } }) => ({ z, p }),
                },
              ],
              target: '#Zooming',
            },
          },
        },
        Done: { type: 'final' },
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
                const l = scrollLayout(context.layout, scroll)
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
                  const l = scrollLayout(context.layout, scroll)
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
              const scroll = getCurrentScroll()
              const l = scrollLayout(context.layout, scroll)
              return l
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
      id: 'Zooming',
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
                  const scroll = getCurrentScroll()
                  const l = scrollLayout(context.layout, scroll)
                  return l
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
                actions: [assign({ animating: () => true }), 'syncAnimation'],
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
                        expandLayoutCenter(context.origLayout, EXPAND_PANNING),
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
})

//// pointerMachine
//// PointerMachine
//// PointerState
//// PointerSend

type PointerMachine = typeof pointerMachine

type PointerState = StateFrom<typeof pointerMachine>

export type PointerSend = (events: _PointerEvent) => void

type PointerRef = ActorRefFrom<typeof pointerMachine>

const selectMode = (pointer: PointerState) => pointer.context.mode
const selectLayout = (pointer: PointerState) => pointer.context.layout
const selectLayoutConfig = (pointer: PointerState) =>
  pointer.context.layout.config
const selectLayoutContainer = (pointer: PointerState) =>
  pointer.context.layout.container
const selectLayoutSvg = (pointer: PointerState) => pointer.context.layout.svg
const selectLayoutSvgScaleS = (pointer: PointerState) =>
  pointer.context.layout.svgScale.s
const selectLayoutSvgOffset = (pointer: PointerState) =>
  pointer.context.layout.svgOffset
const selectLayoutScroll = (pointer: PointerState) =>
  pointer.context.layout.scroll
const selectOrigLayoutSvg = (pointer: PointerState) =>
  pointer.context.origLayout.svg
const selectCursor = (pointer: PointerState) => pointer.context.cursor

////

export function pointerStart(): void {
  pointerActor.start()
}

export function pointerSend(ev: _PointerEvent): void {
  pointerActor.send(ev)
}

export function usePointerMode(): PointerMode {
  return useSelector(pointerActor, selectMode)
}
export function usePointerLayout(): Layout {
  return useSelector(pointerActor, selectLayout)
}

const pointerActor = createActor(pointerMachine, {
  systemId: 'system-pointer1',
  //inspect,
})

pointerActor.on('SEARCH', ({ psvg }) => notifySearchStart(psvg))
pointerActor.on('SEARCH.END.DONE', ({ psvg, info, layout }) => {
  notifySearchEndDone(psvg, info, layout)
  notifyUiOpen(psvg, info, layout)
})
pointerActor.on('LOCK', ({ ok }) => notifyUiOpenDone(ok))
pointerActor.on('ZOOM.START', ({ layout, zoom, z }) =>
  notifyZoomStart(layout, zoom, z)
)
pointerActor.on('ZOOM.END', ({ layout, zoom }) => notifyZoomEnd(layout, zoom))
pointerActor.on('LAYOUT', ({ layout }) => notifyZoomEnd(layout, 1))
pointerActor.on('MODE', ({ mode }) => reflectMode(mode))
pointerActor.start()

const pointerSearchEnd = (res: Readonly<SearchRes>) =>
  pointerActor.send({ type: 'SEARCH.END', res })
const pointerSearchLock = (psvg: Vec) =>
  pointerActor.send({ type: 'SEARCH.LOCK', psvg })
const pointerSearchUnlock = () => pointerActor.send({ type: 'SEARCH.UNLOCK' })

const resizeCb = (origLayout: Readonly<Layout>, force: boolean) => {
  pointerSend({ type: 'RESIZE', layout: origLayout, force })
}

registerCbs({
  searchEndCb: pointerSearchEnd,
  uiOpenCb: pointerSearchLock,
  uiCloseDoneCb: pointerSearchUnlock,
  resizeCb: resizeCb,
})

//let pointereventmask: boolean = false
//let toucheventmask: boolean = false
export let clickeventmask: boolean = false
export let scrolleventmask: boolean = false

function reflectMode(mode: PointerMode): void {
  //pointereventmask = mode !== 'pointing'
  //toucheventmask = mode !== 'pointing'
  // - xstate-pointer receives 'click' to cancel 'panning'
  // - xstate-pointer ignores 'click' to pass through (emulated)
  //  'click' to shadow; shadow receives 'click' to cancel 'locked'
  clickeventmask = mode === 'locked'
  scrolleventmask = mode !== 'panning'
  if (mode === 'panning') {
    scrollTimeoutActorSend({ type: 'START' })
  } else {
    scrollTimeoutActorSend({ type: 'STOP' })
  }
}

//// handlers

export const pointerSendEvent = (
  // excluding key down/up events
  event: ReactUIEvent,
  options?: {
    preventDefault?: boolean
    stopPropagation?: boolean
  }
): void => {
  if (options?.preventDefault === false) {
    // skip
  } else {
    //event.ev.preventDefault()
  }
  if (options?.stopPropagation === false) {
    // skip
  } else {
    event.ev.stopPropagation()
  }
  pointerSend(event)
}

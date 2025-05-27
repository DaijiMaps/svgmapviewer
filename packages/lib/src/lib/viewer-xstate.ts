import { useSelector } from '@xstate/react'
import React from 'react'
import { and, assign, createActor, emit, raise, setup } from 'xstate'
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
  type LayoutConfig,
  makeLayout,
  scrollLayout,
  toSvg,
} from './layout'
import { getCurrentScroll } from './scroll'
import {
  type GetDone,
  getDoneCbs,
  scrollSend,
  type SyncSyncDone,
  syncSyncDoneCbs,
} from './scroll-xstate'
import { styleSend } from './style-xstate'
import { syncViewBox } from './svg'
import { type SearchRes } from './types'
import { type VecVec as Vec, type VecVec, vecVec } from './vec/prefixed'
import {
  EXPAND_PANNING,
  type ReactUIEvent,
  type ViewerContext,
  type ViewerEmitted,
  type ViewerEvent,
  type ViewerMode,
  viewerModeLocked,
  viewerModePanning,
  viewerModeTouching,
} from './viewer-types'

//// viewerMachine

const viewerMachine = setup({
  types: {} as {
    context: ViewerContext
    events: ViewerEvent
    emitted: ViewerEmitted
  },
  guards: {
    // key
    shouldReset: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'r',
    shouldZoom: (_, { ev }: { ev: KeyboardEvent }) => keyToZoom(ev.key) !== 0,
    isTouching: ({ context: { touching } }) => touching,
    isMapHtmlRendered: ({ context }) => context.mapHtmlRendered,
    isContainerRendered: () => document.querySelector('.container') !== null,
  },
  actions: {
    //
    // scroll
    //
    syncScroll: ({ context: { layout } }) =>
      scrollSend({ type: 'SYNC', pos: layout.scroll }),
    syncScrollSync: ({ context: { layout } }) =>
      scrollSend({ type: 'SYNCSYNC', pos: layout.scroll }),
    getScroll: (): void => scrollSend({ type: 'GET' }),

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
      mode: viewerModePanning,
      // XXX resetCursor
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
    setModeToTouching: assign({
      mode: viewerModeTouching,
    }),
    setModeToLocked: assign({
      mode: viewerModeLocked,
    }),
    syncMode: ({ context: { mode } }) =>
      styleSend({ type: 'STYLE.MODE', mode }),
    /*
    touchStart: enqueueActions(({ enqueue }) => {
      enqueue.assign({ touching: true })
      enqueue.raise({ type: 'TOUCHING' })
    }),
    touchEnd: enqueueActions(({ enqueue }) => {
      enqueue.assign({ touching: false })
      enqueue.raise({ type: 'TOUCHING.DONE' })
    }),
    */
    startTouching: assign({ touching: true }),
    endTouching: assign({ touching: false }),
    notifyTouching: raise({ type: 'TOUCHING' }),
    notifyTouchingDone: raise({ type: 'TOUCHING.DONE' }),

    startAnimating: assign({ animating: () => true }),
    stopAnimating: assign({ animating: () => false }),
  },
}).createMachine({
  id: 'viewer',
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
    mode: viewerModePanning,
    touching: false,
    animating: false,
    rendered: false,
    mapHtmlRendered: false,
  },
  on: {
    RENDERED: {},
    'RENDERED.MAP-HTML': {
      actions: assign({
        mapHtmlRendered: true,
      }),
    },
    'TOUCH.LOCK': {
      actions: [
        'startTouching',
        'notifyTouching',
        'setModeToTouching',
        emit(({ context: { mode } }) => ({ type: 'MODE', mode })),
        'syncMode',
      ],
    },
    'TOUCH.UNLOCK': {
      actions: [
        'endTouching',
        'notifyTouchingDone',
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
        raise({ type: 'SEARCH.DONE' }),
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
            guard: and(['isContainerRendered', 'isMapHtmlRendered']),
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
            'SEARCH.DONE': {
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
                actions: ['startAnimating', 'syncAnimation'],
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
                    'stopAnimating',
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

////

export function useViewerMode(): ViewerMode {
  return useSelector(viewerActor, (viewer) => viewer.context.mode)
}
export function useViewerLayout(): Layout {
  return useSelector(viewerActor, (viewer) => viewer.context.layout)
}
export function useViewerLayoutConfig(): LayoutConfig {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.config)
}
export function useViewerLayoutContainer(): BoxBox {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.container)
}
export function useViewerLayoutSvg(): BoxBox {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.svg)
}
export function useViewerLayoutSvgScaleS(): number {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.svgScale.s)
}
export function useViewerLayoutSvgOffset(): VecVec {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.svgOffset)
}
export function useViewerLayoutScroll(): BoxBox {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.scroll)
}
export function useViewerOrigLayoutSvg(): BoxBox {
  return useSelector(viewerActor, (viewer) => viewer.context.origLayout.svg)
}
export function useViewerCursor(): VecVec {
  return useSelector(viewerActor, (viewer) => viewer.context.cursor)
}

////

export function viewerActorStart(): void {
  viewerActor.start()
}

export function viewerSend(ev: ViewerEvent): void {
  viewerActor.send(ev)
}

const viewerActor = createActor(viewerMachine, {
  systemId: 'system-pointer1',
})

viewerActor.on('SEARCH', ({ psvg }) => notifySearchStart(psvg))
viewerActor.on('SEARCH.END.DONE', ({ psvg, info, layout }) => {
  notifySearchEndDone(psvg, info, layout)
  notifyUiOpen(psvg, info, layout)
})
viewerActor.on('LOCK', ({ ok }) => notifyUiOpenDone(ok))
viewerActor.on('ZOOM.START', ({ layout, zoom, z }) =>
  notifyZoomStart(layout, zoom, z)
)
viewerActor.on('ZOOM.END', ({ layout, zoom }) => notifyZoomEnd(layout, zoom))
viewerActor.on('LAYOUT', ({ layout }) => notifyZoomEnd(layout, 1))
viewerActor.on('MODE', ({ mode }) => reflectMode(mode))
viewerActor.start()

function viewerSearchEnd(res: Readonly<SearchRes>) {
  viewerActor.send({ type: 'SEARCH.END', res })
}
function viewerSearchLock(psvg: Vec) {
  viewerActor.send({ type: 'SEARCH.LOCK', psvg })
}
function viewerSearchUnlock() {
  viewerActor.send({ type: 'SEARCH.UNLOCK' })
}
function resizeCb(origLayout: Readonly<Layout>, force: boolean) {
  viewerSend({ type: 'RESIZE', layout: origLayout, force })
}

registerCbs({
  searchEndCb: viewerSearchEnd,
  uiOpenCb: viewerSearchLock,
  uiCloseDoneCb: viewerSearchUnlock,
  resizeCb: resizeCb,
})

function getDoneCb(ev: GetDone) {
  if (ev.scroll !== null) {
    viewerSend({ type: 'SCROLL.GET.DONE', scroll: ev.scroll })
  }
}
function syncSyncDoneCb(ev: SyncSyncDone) {
  if (ev.scroll !== null) {
    viewerSend({ type: 'SCROLL.SYNCSYNC.DONE', scroll: ev.scroll })
  }
}
getDoneCbs.add(getDoneCb)
syncSyncDoneCbs.add(syncSyncDoneCb)

//let pointereventmask: boolean = false
//let toucheventmask: boolean = false
export let clickeventmask: boolean = false
export let scrolleventmask: boolean = false

function reflectMode(mode: ViewerMode): void {
  //pointereventmask = mode !== 'pointing'
  //toucheventmask = mode !== 'pointing'
  // - xstate-viewer receives 'click' to cancel 'panning'
  // - xstate-viewer ignores 'click' to pass through (emulated)
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

export function viewerSendEvent(
  // excluding key down/up events
  event: ReactUIEvent,
  options?: {
    preventDefault?: boolean
    stopPropagation?: boolean
  }
): void {
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
  viewerSend(event)
}

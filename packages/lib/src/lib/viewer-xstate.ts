import { useSelector } from '@xstate/react'
import React from 'react'
import { and, assign, createActor, emit, raise, setup } from 'xstate'
import { animationEndLayout, animationHome, animationZoom } from './animation'
import { type Animation } from './animation-types'
import { type BoxBox, boxCenter } from './box/prefixed'
import {
  notifyAnimation,
  notifyLayout,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyZoomEnd,
  notifyZoomStart,
  registerCbs,
} from './config-xstate'
import { fromMatrixSvg } from './coord'
import { isShadowRootRendered } from './dom'
import { keyToZoom } from './key'
import {
  emptyLayout,
  expandLayoutCenter,
  type Layout,
  makeLayout,
  scrollLayout,
} from './layout'
import { MAP_HTML_ROOT_ID } from './map-html-react'
import {
  MAP_SVG_LABELS_ROOT_ID,
  MAP_SVG_MARKERS_ROOT_ID,
  MAP_SVG_ROOT_ID,
  MAP_SVG_SYMBOLS_ROOT_ID,
} from './map-svg-react'
import { getCurrentScroll } from './scroll'
import { type GetDone, type SyncSyncDone } from './scroll-types'
import { scrollCbs, scrollSend } from './scroll-xstate'
import { styleSend } from './style-xstate'
import { type SearchRes } from './types'
import { UI_ROOT_ID } from './ui-react'
import { type VecVec as Vec, vecVec } from './vec/prefixed'
import {
  EXPAND_PANNING,
  type ReactUIEvent,
  type ResizeRequest,
  type SearchEnd,
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
    isHoming: ({ context: { homing } }) => homing,
    isContainerRendered: () => document.querySelector('.container') !== null,
    isMapHtmlRendered: () => isShadowRootRendered(MAP_HTML_ROOT_ID),
    isMapSvgRendered: () => isShadowRootRendered(MAP_SVG_ROOT_ID),
    isMapSvgSymbolsRendered: () =>
      isShadowRootRendered(MAP_SVG_SYMBOLS_ROOT_ID),
    isMapSvgMarkersRendered: () =>
      isShadowRootRendered(MAP_SVG_MARKERS_ROOT_ID),
    isMapSvgLabelsRendered: () => isShadowRootRendered(MAP_SVG_LABELS_ROOT_ID),
    isUiRendered: () => isShadowRootRendered(UI_ROOT_ID),
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
    syncAnimation: ({ context: { animation } }) => notifyAnimation(animation),
    //
    // layout
    //
    scrollLayout: assign({
      layout: (
        { context: { layout } },
        { scroll }: { scroll: BoxBox }
      ): Layout => scrollLayout(layout, scroll),
    }),
    syncLayout: ({ context: { layout, rendered } }) =>
      notifyLayout(layout, rendered),
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

    resizeLayout: assign({
      rendered: false,
      origLayout: (_, { layout }: ResizeRequest) => layout,
      layout: (_, { layout }: ResizeRequest) =>
        expandLayoutCenter(layout, EXPAND_PANNING),
    }),
    updateLayoutFromScroll: assign({
      layout: ({ context }) => {
        const { scroll } = getCurrentScroll()
        return scrollLayout(context.layout, scroll)
      },
    }),
    notifyZoomStart: emit(
      ({ context: { layout, zoom, z } }): ViewerEmitted => ({
        type: 'ZOOM.START',
        layout,
        zoom,
        z: z === null ? 0 : z,
      })
    ),
    notifyZoomEnd: emit(
      ({ context: { layout, zoom } }): ViewerEmitted => ({
        type: 'ZOOM.END',
        layout,
        zoom,
      })
    ),
    notifySearch: emit(({ context }): ViewerEmitted => {
      const { scroll } = getCurrentScroll()
      const l = scrollLayout(context.layout, scroll)
      const m = fromMatrixSvg(l).inverse()
      return {
        type: 'SEARCH',
        psvg: m.transformPoint(context.cursor),
      }
    }),
    notifySearchDone: raise({ type: 'SEARCH.DONE' }),
    notifySearchEndDone: emit(
      ({ context }, { res }: SearchEnd): ViewerEmitted => {
        const { scroll } = getCurrentScroll()
        const l = scrollLayout(context.layout, scroll)
        return {
          type: 'SEARCH.END.DONE',
          psvg: res.psvg,
          info: res.info,
          layout: l,
        }
      }
    ),
    endHoming: assign({
      cursor: ({ context }) => boxCenter(context.origLayout.container),
      layout: ({ context }) =>
        expandLayoutCenter(context.origLayout, EXPAND_PANNING),
      homing: () => false,
    }),
    notifyMode: emit(
      ({ context: { mode } }): ViewerEmitted => ({ type: 'MODE', mode })
    ),
    notifyLock: emit({ type: 'LOCK', ok: true }),
    setRendered: assign({ rendered: true }),
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
  },
  on: {
    'TOUCH.LOCK': {
      actions: [
        'startTouching',
        'notifyTouching',
        'setModeToTouching',
        'notifyMode',
      ],
    },
    'TOUCH.UNLOCK': {
      actions: [
        'endTouching',
        'notifyTouchingDone',
        'setModeToPanning',
        'notifyMode',
      ],
    },
    'SEARCH.LOCK': {
      // XXX failure?
      actions: ['notifyLock', 'setModeToLocked', 'notifyMode'],
    },
    'SEARCH.UNLOCK': {
      actions: ['setModeToPanning', 'notifyMode', 'notifySearchDone'],
    },
  },
  states: {
    Resizing: {
      initial: 'WaitingForResizeRequest',
      onDone: 'Panning',
      states: {
        WaitingForResizeRequest: {
          on: {
            RESIZE: {
              actions: { type: 'resizeLayout', params: ({ event }) => event },
              target: 'WaitingForMapRendered',
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
              target: 'WaitingForMapRendered',
            },
          },
        },
        WaitingForMapRendered: {
          after: { 250: { target: 'WaitingForMapRendered', reenter: true } },
          always: {
            guard: and([
              'isContainerRendered',
              'isMapSvgRendered',
              'isMapSvgSymbolsRendered',
              'isMapSvgMarkersRendered',
              'isMapSvgLabelsRendered',
              'isUiRendered',
            ]),
            target: 'Layouting',
          },
        },
        Layouting: {
          entry: 'syncLayout',
          on: {
            RENDERED: {
              actions: ['setRendered', 'syncLayout', 'resetCursor'],
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
    Panning: {
      on: {
        // XXX force layout (resize)
        RESIZE: {
          actions: [{ type: 'resizeLayout', params: ({ event }) => event }],
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
        RECENTER: {
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
      onDone: 'Panning', // XXX do `Recentering' conditionally?
      states: {
        Starting: {
          always: {
            actions: 'notifySearch',
            target: 'WaitingForSearchEnd',
          },
        },
        WaitingForSearchEnd: {
          on: {
            'SEARCH.END': {
              actions: {
                type: 'notifySearchEndDone',
                params: ({ event }) => event,
              },
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
      initial: 'Stopping',
      onDone: 'Panning',
      states: {
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
            50: {
              target: 'Layouting',
            },
            // XXX
            // XXX
            // XXX
          },
        },
        Layouting: {
          always: {
            actions: [
              'updateLayoutFromScroll',
              'syncLayout',
              // fast sync - sync scroll NOT after resize
              'syncScroll',
            ],
            // keep panning
            target: 'Done',
          },
        },
        Done: {
          type: 'final',
        },
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
            50: {
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
              'updateLayoutFromScroll',
              'startZoom',
              'updateZoom',
              'notifyZoomStart',
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
                    // fast sync - sync scroll NOT after resize
                    'syncScroll',
                    'notifyZoomEnd',
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
                  guard: 'isHoming',
                  actions: [
                    'endHoming',
                    'syncLayout',
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

export function useViewerLayoutSvgScaleS(): number {
  return useSelector(viewerActor, (viewer) => viewer.context.layout.svgScale.s)
}

////

export function viewerActorStart(): void {
  viewerActor.start()
}

/*
export type ViewerInspect = typeof viewerActor.options.inspect
export function inspect(iev: InspectionEvent) {
  if (iev && iev?.actorRef?.options?.systemId === 'system-viewer1') {
    const type =
      iev?.event?.type || iev?.action?.type || iev?.action?.params?.event?.type
    if (type && !type.match(/MOVE/)) {
      console.log(type, iev)
    }
  }
}
*/

export function viewerSend(ev: ViewerEvent): void {
  viewerActor.send(ev)
}

const viewerActor = createActor(viewerMachine, {
  systemId: 'system-viewer1',
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
viewerActor.on('MODE', ({ mode }) => {
  // XXX
  // XXX
  // XXX
  styleSend({ type: 'STYLE.MODE', mode })
  reflectMode(mode)
  // XXX
  // XXX
  // XXX
})
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
scrollCbs.getDoneCbs.add(getDoneCb)
scrollCbs.syncSyncDoneCbs.add(syncSyncDoneCb)

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

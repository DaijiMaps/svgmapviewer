import { useSelector } from '@xstate/react'
import { and, assign, createActor, emit, raise, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import {
  floorDoneCbs,
  floorLockCbs,
  modeCbs,
  notifyAnimation,
  notifyFloor,
  notifyFloorUnlock,
  notifyLayout,
  notifyMode,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyZoomEnd,
  notifyZoomStart,
  renderedCbs,
  resizeCbs,
  searchEndCbs,
  uiActionRecenterCbs,
  uiActionResetCbs,
  uiActionRotateCbs,
  uiActionZoomInCbs,
  uiActionZoomOutCbs,
  uiCloseDoneCbs,
  uiOpenCbs,
  zoomEndCbs,
  zoomStartCbs,
} from '../../event'
import { type ResizeInfo, type SearchRes } from '../../types'
import { boxCenter } from '../box/prefixed'
import { type VecVec as Vec, vecVec } from '../vec/prefixed'
import {
  animationEndLayout,
  animationHome,
  animationRotate,
  animationZoom,
} from './animation'
import { type Animation } from './animation-types'
import { fromMatrixSvg } from './coord'
import { keyToZoom } from './key'
import {
  emptyLayout,
  expandLayoutCenter,
  type Layout,
  layoutToDeg,
  resetLayout,
  rotateLayout,
  scrollLayout,
} from './layout'
import { getCurrentScroll } from './scroll'
import { type GetDone, type SyncSyncDone } from './scroll-types'
import { scrollCbs, scrollSend } from './scroll-xstate'
import {
  EXPAND_PANNING,
  type ReactUIEvent,
  type ResizeRequest,
  type SearchEnd,
  type SwitchRequest,
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
    shouldRecenter: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 'c',
    shouldRotate: (_, { ev }: { ev: KeyboardEvent }) => ev.key === 't',
    shouldZoom: (_, { ev }: { ev: KeyboardEvent }) => keyToZoom(ev.key) !== 0,
    isTouching: ({ context: { touching } }) => touching,
    isHoming: ({ context: { homing } }) => homing,
    isZoomWanted: ({ context: { want_animation } }) =>
      want_animation === 'zoom',
    isRotateWanted: ({ context: { want_animation } }) =>
      want_animation === 'rotate',
    isContainerRendered: () => document.querySelector('.container') !== null,
    isMapRendered: () => svgMapViewerConfig.isMapRendered(),
    isUiRendered: () => svgMapViewerConfig.isUiRendered(),
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
          ? animationHome(layout, resetLayout(layout))
          : animationZoom(layout, z, cursor),
    }),
    startRotate: assign({
      animation: ({ context: { layout, cursor } }): null | Animation =>
        animationRotate(layout, 90, cursor),
    }),
    updateZoom: assign({
      prevLayout: ({ context: { layout } }): null | Layout => layout,
      layout: ({ context: { layout, animation } }): Layout =>
        animation === null ? layout : animationEndLayout(layout, animation),
    }),
    endZoom: assign({
      prevLayout: null,
      want_animation: null,
      animation: null,
      z: null,
      zoom: ({ context: { z, zoom } }) =>
        z === null ? zoom : zoom * Math.pow(2, z),
    }),
    endRotate: assign({
      prevLayout: null,
      want_animation: null,
      animation: null,
    }),
    wantZoom: assign({ want_animation: 'zoom' }),
    wantRotate: assign({ want_animation: 'rotate' }),
    syncAnimation: ({ context: { animation } }) => {
      const matrix =
        animation?.move?.q ?? animation?.zoom?.q ?? animation?.rotate?.q ?? null
      const origin =
        animation?.move?.o ?? animation?.zoom?.o ?? animation?.rotate?.o ?? null
      if (matrix !== null) {
        notifyAnimation({ matrix, origin })
      }
    },
    //
    // layout
    //
    syncLayout: ({ context: { layout, rendered } }) =>
      notifyLayout({ layout, force: rendered }),
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
          res:
            res === null
              ? null
              : {
                  psvg: res.psvg,
                  info: res.info,
                  layout: l,
                },
        }
      }
    ),
    endHoming: assign({
      cursor: ({ context }) => boxCenter(context.origLayout.container),
      layout: ({ context }) =>
        rotateLayout(
          expandLayoutCenter(context.origLayout, EXPAND_PANNING),
          // XXX
          // XXX
          // XXX
          layoutToDeg(context.layout)
          // XXX
          // XXX
          // XXX
        ),
      homing: () => false,
    }),
    notifyMode: emit(
      ({ context: { mode } }): ViewerEmitted => ({ type: 'MODE', mode })
    ),
    notifyLock: emit({ type: 'LOCK', ok: true }),
    setRendered: assign({ rendered: true }),
    notifySwitch: emit(
      (_, { fidx }: SwitchRequest): ViewerEmitted => ({
        type: 'SWITCH',
        fidx,
      })
    ),
    notifySwitchDone: emit(
      (): ViewerEmitted => ({
        type: 'SWITCH.DONE',
      })
    ),
  },
}).createMachine({
  id: 'viewer',
  initial: 'Resizing',
  context: {
    origLayout: emptyLayout,
    layout: emptyLayout,
    prevLayout: null,
    cursor: boxCenter(emptyLayout.container),
    z: null,
    zoom: 1,
    homing: false,
    want_animation: null,
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
      onDone: 'Appearing',
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
              'isMapRendered',
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
    Appearing: {
      on: {
        'ANIMATION.END': {
          target: 'Panning',
        },
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
          actions: ['zoomHome', 'wantZoom'],
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
              'wantZoom',
            ],
            target: 'Zooming',
          },
          {
            guard: {
              type: 'shouldRotate',
              params: ({ event }) => ({ ev: event.ev }),
            },
            actions: 'wantRotate',
            target: 'Zooming',
          },
        ],
        CLICK: {
          // only when search entries exist
          guard: () => svgMapViewerConfig.searchEntries.length > 0,
          actions: [
            {
              type: 'cursor',
              params: ({ event }) => ({ ev: event.ev }),
            },
          ],
          target: 'Searching',
        },
        SWITCH: {
          actions: {
            type: 'notifySwitch',
            params: ({ event }) => event,
          },
          target: 'Switching',
        },
        CONTEXTMENU: {
          target: 'Recentering',
        },
        ROTATE: {
          actions: 'wantRotate',
          target: 'Zooming',
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
            'wantZoom',
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
                'wantZoom',
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
    Switching: {
      initial: 'Animating',
      onDone: 'Panning',
      states: {
        Animating: {
          on: {
            'SWITCH.DONE': {
              actions: {
                type: 'notifySwitchDone',
              },
              target: 'Done',
            },
          },
        },
        Done: {
          type: 'final',
        },
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
          always: [
            {
              guard: 'isZoomWanted',
              actions: [
                'updateLayoutFromScroll',
                'startZoom',
                'updateZoom',
                'notifyZoomStart',
              ],
              target: 'Animating',
            },
            {
              guard: 'isRotateWanted',
              actions: [
                'updateLayoutFromScroll',
                'startRotate',
                'updateZoom',
                'notifyZoomStart',
              ],
              target: 'Animating',
            },
          ],
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
                'ANIMATION.END': [
                  {
                    guard: 'isZoomWanted',
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
                  {
                    guard: 'isRotateWanted',
                    actions: [
                      'endRotate',
                      'syncLayout',
                      // fast sync - sync scroll NOT after resize
                      'syncScroll',
                      'notifyZoomEnd',
                      'stopAnimating',
                      'syncAnimation',
                    ],
                    target: 'Homing',
                  },
                ],
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
viewerActor.on('SEARCH.END.DONE', ({ res }) => {
  if (res === null) {
    viewerSearchUnlock()
  } else {
    notifySearchEndDone(res)
    notifyUiOpen(res.psvg)
  }
})
viewerActor.on('LOCK', ({ ok }) => notifyUiOpenDone(ok))
viewerActor.on('ZOOM.START', (args) => notifyZoomStart(args))
viewerActor.on('ZOOM.END', (end) => notifyZoomEnd(end))
viewerActor.on('LAYOUT', ({ layout }) => notifyZoomEnd({ layout, zoom: 1 }))
viewerActor.on('MODE', ({ mode }) => notifyMode(mode))

viewerActor.on('SWITCH', ({ fidx }) => notifyFloor(fidx))
viewerActor.on('SWITCH.DONE', () => notifyFloorUnlock())

viewerActor.start()

////

function viewerSearchEnd(res: Readonly<null | SearchRes>) {
  viewerActor.send({ type: 'SEARCH.END', res })
}
function viewerSearchLock(psvg: Vec) {
  viewerActor.send({ type: 'SEARCH.LOCK', psvg })
}
function viewerSearchUnlock() {
  viewerActor.send({ type: 'SEARCH.UNLOCK' })
}
function resizeCb({ layout, force }: Readonly<ResizeInfo>) {
  viewerSend({ type: 'RESIZE', layout, force })
}

function viewerSwitch(fidx: number): void {
  viewerSend({ type: 'SWITCH', fidx })
}
function viewerSwitchDone(): void {
  viewerSend({ type: 'SWITCH.DONE' }) // XXX animation end
}
floorLockCbs.add(viewerSwitch)
floorDoneCbs.add(viewerSwitchDone) // XXX animation end

searchEndCbs.add(viewerSearchEnd)
uiOpenCbs.add(viewerSearchLock)
uiCloseDoneCbs.add(viewerSearchUnlock)
resizeCbs.add(resizeCb)

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
export let wheeleventmask: boolean = false

function reflectMode(mode: ViewerMode): void {
  //pointereventmask = mode !== 'pointing'
  //toucheventmask = mode !== 'pointing'
  // - xstate-viewer receives 'click' to cancel 'panning'
  // - xstate-viewer ignores 'click' to pass through (emulated)
  //  'click' to shadow; shadow receives 'click' to cancel 'locked'
  clickeventmask = mode === 'locked'
  scrolleventmask = mode !== 'panning'
  wheeleventmask = mode === 'locked'
}
modeCbs.add(reflectMode)

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

function maskWheel() {
  wheeleventmask = true
}
function unmaskWheel() {
  wheeleventmask = false
}
zoomStartCbs.add(maskWheel)
zoomEndCbs.add(unmaskWheel)

function handleUiActionReset() {
  viewerSend({ type: 'LAYOUT.RESET' })
}
function handleUiActionRecenter() {
  viewerSend({ type: 'RECENTER' })
}
function handleUiActionRotate() {
  viewerSend({ type: 'ROTATE' })
}
function handleUiActionZoomOut() {
  viewerSend({ type: 'ZOOM.ZOOM', z: -1, p: null })
}
function handleUiActionZoomIn() {
  viewerSend({ type: 'ZOOM.ZOOM', z: 1, p: null })
}

uiActionResetCbs.add(handleUiActionReset)
uiActionRecenterCbs.add(handleUiActionRecenter)
uiActionRotateCbs.add(handleUiActionRotate)
uiActionZoomOutCbs.add(handleUiActionZoomOut)
uiActionZoomInCbs.add(handleUiActionZoomIn)

function handleRendered() {
  viewerSend({ type: 'RENDERED' })
}

renderedCbs.add(handleRendered)

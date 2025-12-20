import { and, assign, createActor, emit, raise, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import {
  actionCbs,
  floorCbs,
  notifyFloorSelect,
  notifyFloorUnlock,
  notifyScrollGet,
  notifyScrollSync,
  notifyScrollSyncSync,
  notifySearchEndDone,
  notifySearchStart,
  notifyStyleAnimation,
  notifyStyleLayout,
  notifyStyleMode,
  notifyStyleZoomEnd,
  notifyStyleZoomStart,
  notifyUiOpen,
  notifyUiOpenDone,
  renderedCbs,
  scrollCbs,
  searchCbs,
  styleCbs,
  touchCbs,
  uiCbs,
} from '../../event'
import {
  type Dir,
  type ResizeInfo,
  type SearchReq,
  type SearchRes,
  type Zoom,
} from '../../types'
import { boxCenter, type BoxBox } from '../box/prefixed'
import { vecVec, type VecVec as Vec } from '../vec/prefixed'
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
  layoutToDeg,
  resetLayout,
  rotateLayout,
  scrollLayout,
  type Layout,
} from './layout'
import { getCurrentScroll } from './scroll'
import {
  EXPAND_PANNING,
  viewerModeLocked,
  viewerModePanning,
  viewerModeTouching,
  type ReactUIEvent,
  type ResizeRequest,
  type SearchEnd,
  type SwitchRequest,
  type ViewerContext,
  type ViewerEmitted,
  type ViewerEvent,
  type ViewerMode,
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
    emitSyncScroll: emit(
      ({ context: { layout } }): ViewerEmitted => ({
        type: 'SCROLL.SYNC',
        pos: layout.scroll,
      })
    ),
    emitSyncScrollSync: emit(
      ({ context: { layout } }): ViewerEmitted => ({
        type: 'SCROLL.SYNCSYNC',
        pos: layout.scroll,
      })
    ),
    emitGetScroll: emit((): ViewerEmitted => ({ type: 'SCROLL.GET' })),

    //
    // move + zoom
    //
    zoomKey: assign({
      z: (_, { ev }: { ev: KeyboardEvent }): Dir | 0 => keyToZoom(ev.key),
    }),
    zoomHome: assign({
      z: (): null | Dir => null,
      zoom: () => 1,
      homing: () => true,
    }),
    zoomEvent: assign({
      z: (_, { z }: { z: Dir; p: null | Vec }): Dir => z,
      cursor: (
        { context: { cursor } },
        { p }: { z: Dir; p: null | Vec }
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
    emitSyncAnimation: emit(
      ({ context: { animation } }): ViewerEmitted => ({
        type: 'SYNC.ANIMATION',
        animation,
      })
    ),
    //
    // layout
    //
    emitSyncLayout: emit(
      ({ context: { layout, rendered } }): ViewerEmitted => ({
        type: 'SYNC.LAYOUT',
        layout,
        force: rendered,
      })
    ),
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
    startTouching: assign({ touching: true }),
    endTouching: assign({ touching: false }),
    raiseTouching: raise({ type: 'TOUCHING' }),
    raiseTouchingDone: raise({ type: 'TOUCHING.DONE' }),

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
    emitZoomStart: emit(
      ({ context: { layout, zoom, z } }): ViewerEmitted => ({
        type: 'ZOOM.START',
        layout,
        zoom,
        z: z === null ? 0 : z,
      })
    ),
    emitZoomEnd: emit(
      ({ context: { layout, zoom } }): ViewerEmitted => ({
        type: 'ZOOM.END',
        layout,
        zoom,
      })
    ),
    emitSearch: emit(({ context: { fidx, layout, cursor } }): ViewerEmitted => {
      const { scroll } = getCurrentScroll()
      const l = scrollLayout(layout, scroll)
      const m = fromMatrixSvg(l).inverse()
      const psvg = m.transformPoint(cursor)
      const pgeo = svgMapViewerConfig.mapCoord.matrix
        .inverse()
        .transformPoint(psvg)
      const req: SearchReq = { pgeo, fidx }
      return { type: 'SEARCH', req }
    }),
    raiseSearchDone: raise({ type: 'SEARCH.DONE' }),
    raiseSearchEndDone: emit(
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
                  fidx: context.fidx,
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
    emitMode: emit(
      ({ context: { mode } }): ViewerEmitted => ({ type: 'MODE', mode })
    ),
    emitLock: emit({ type: 'LOCK', ok: true }),
    setRendered: assign({ rendered: true }),
    emitSwitch: emit(
      (_, { fidx }: SwitchRequest): ViewerEmitted => ({
        type: 'SWITCH',
        fidx,
      })
    ),
    emitSwitchDone: emit(
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
    fidx: 0,
  },
  on: {
    'TOUCH.LOCK': {
      actions: [
        'startTouching',
        'raiseTouching',
        'setModeToTouching',
        'emitMode',
      ],
    },
    'TOUCH.UNLOCK': {
      actions: [
        'endTouching',
        'raiseTouchingDone',
        'setModeToPanning',
        'emitMode',
      ],
    },
    'SEARCH.LOCK': {
      // XXX failure?
      actions: ['emitLock', 'setModeToLocked', 'emitMode'],
    },
    'SEARCH.UNLOCK': {
      actions: ['setModeToPanning', 'emitMode', 'raiseSearchDone'],
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
          entry: 'emitSyncLayout',
          on: {
            RENDERED: {
              actions: ['setRendered', 'emitSyncLayout', 'resetCursor'],
              target: 'Syncing',
            },
          },
        },
        Syncing: {
          // slow sync - sync scroll after resize
          entry: 'emitSyncScrollSync',
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
          actions: [
            {
              type: 'cursor',
              params: ({ event }) => ({ ev: event.ev }),
            },
          ],
          target: 'Searching',
        },
        SWITCH: {
          actions: [
            assign({
              fidx: ({ event }) => event.fidx,
            }),
            {
              type: 'emitSwitch',
              params: ({ event }) => event,
            },
          ],
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
          entry: 'emitGetScroll',
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
            actions: 'emitSearch',
            target: 'WaitingForSearchEnd',
          },
        },
        WaitingForSearchEnd: {
          on: {
            'SEARCH.END': {
              actions: {
                type: 'raiseSearchEndDone',
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
                type: 'emitSwitchDone',
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
          entry: 'emitGetScroll',
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
              'emitSyncLayout',
              // fast sync - sync scroll NOT after resize
              'emitSyncScroll',
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
          entry: 'emitGetScroll',
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
                'emitZoomStart',
              ],
              target: 'Animating',
            },
            {
              guard: 'isRotateWanted',
              actions: [
                'updateLayoutFromScroll',
                'startRotate',
                'updateZoom',
                'emitZoomStart',
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
                actions: ['startAnimating', 'emitSyncAnimation'],
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
                      'emitSyncLayout',
                      // fast sync - sync scroll NOT after resize
                      'emitSyncScroll',
                      'emitZoomEnd',
                      'stopAnimating',
                      'emitSyncAnimation',
                    ],
                    target: 'Homing',
                  },
                  {
                    guard: 'isRotateWanted',
                    actions: [
                      'endRotate',
                      'emitSyncLayout',
                      // fast sync - sync scroll NOT after resize
                      'emitSyncScroll',
                      'emitZoomEnd',
                      'stopAnimating',
                      'emitSyncAnimation',
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
                    'emitSyncLayout',
                    // fast sync - sync scroll NOT after resize
                    'emitSyncScroll',
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

const viewerActor = createActor(viewerMachine, {
  systemId: 'system-viewer1',
})

export function viewerActorStart(): void {
  viewerActor.start()
}

export function viewerSend(ev: ViewerEvent): void {
  viewerActor.send(ev)
}

////

viewerActor.on('SEARCH', ({ req }) => notifySearchStart(req))
viewerActor.on('SEARCH.END.DONE', ({ res }) => {
  if (res === null) {
    viewerActor.send({ type: 'SEARCH.UNLOCK' })
  } else {
    notifySearchEndDone(res)
    notifyUiOpen(res.psvg)
  }
})
viewerActor.on('LOCK', ({ ok }) => notifyUiOpenDone(ok))
viewerActor.on('ZOOM.START', (args) => notifyStyleZoomStart(args))
viewerActor.on('ZOOM.END', (end) => notifyStyleZoomEnd(end))
viewerActor.on('LAYOUT', ({ layout }) =>
  notifyStyleZoomEnd({ layout, zoom: 1 })
)
viewerActor.on('MODE', ({ mode }) => notifyStyleMode(mode))

viewerActor.on('SWITCH', ({ fidx }) => notifyFloorSelect(fidx))
viewerActor.on('SWITCH.DONE', () => notifyFloorUnlock())
viewerActor.on('SYNC.ANIMATION', ({ animation }) => {
  const matrix =
    animation?.move?.q ?? animation?.zoom?.q ?? animation?.rotate?.q ?? null
  const origin =
    animation?.move?.o ?? animation?.zoom?.o ?? animation?.rotate?.o ?? null
  if (matrix !== null) {
    notifyStyleAnimation({ matrix, origin })
  }
})
viewerActor.on('SYNC.LAYOUT', ({ layout, force }) =>
  notifyStyleLayout({ layout, force })
)
viewerActor.on('SCROLL.SYNC', ({ pos }) => notifyScrollSync(pos))
viewerActor.on('SCROLL.SYNCSYNC', ({ pos }) => notifyScrollSyncSync(pos))
viewerActor.on('SCROLL.GET', () => notifyScrollGet())

////

//let pointereventmask: boolean = false
//let toucheventmask: boolean = false
export let clickeventmask: boolean = false
export let scrolleventmask: boolean = false
export let wheeleventmask: boolean = false

function reflectMode(mode: ViewerMode): void {
  clickeventmask = mode === 'locked'
  scrolleventmask = mode !== 'panning'
  wheeleventmask = mode === 'locked'
}

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

////

export function viewerCbsStart(): void {
  floorCbs.lock.add(function (fidx: number): void {
    viewerSend({ type: 'SWITCH', fidx })
  })
  floorCbs.selectDone.add(() => viewerSend({ type: 'SWITCH.DONE' }))

  searchCbs.end.add((res: Readonly<null | SearchRes>) =>
    viewerActor.send({ type: 'SEARCH.END', res })
  )
  uiCbs.open.add((psvg: Vec) => viewerActor.send({ type: 'SEARCH.LOCK', psvg }))
  uiCbs.closeDone.add(() => viewerActor.send({ type: 'SEARCH.UNLOCK' }))

  scrollCbs.getDone.add((scroll: Readonly<null | BoxBox>) => {
    if (scroll !== null) {
      viewerSend({ type: 'SCROLL.GET.DONE', scroll })
    }
  })
  scrollCbs.syncSyncDone.add((scroll: Readonly<null | BoxBox>) => {
    if (scroll !== null) {
      viewerSend({ type: 'SCROLL.SYNCSYNC.DONE', scroll })
    }
  })

  styleCbs.resize.add(({ layout, force }: Readonly<ResizeInfo>) =>
    viewerSend({ type: 'RESIZE', layout, force })
  )
  styleCbs.mode.add(reflectMode)
  styleCbs.zoomStart.add(() => {
    wheeleventmask = true
  })
  styleCbs.zoomEnd.add(() => {
    wheeleventmask = false
  })

  actionCbs.reset.add(() => viewerSend({ type: 'LAYOUT.RESET' }))
  actionCbs.recenter.add(() => viewerSend({ type: 'RECENTER' }))
  actionCbs.rotate.add(() => viewerSend({ type: 'ROTATE' }))
  actionCbs.zoomOut.add(() => viewerSend({ type: 'ZOOM.ZOOM', z: -1, p: null }))
  actionCbs.zoomIn.add(() => viewerSend({ type: 'ZOOM.ZOOM', z: 1, p: null }))

  touchCbs.multiStart.add(() => viewerSend({ type: 'TOUCH.LOCK' }))
  touchCbs.multiEnd.add(() => viewerSend({ type: 'TOUCH.UNLOCK' }))
  touchCbs.zoom.add(({ z, p }: Zoom) =>
    viewerSend({ type: 'ZOOM.ZOOM', z: z > 0 ? 1 : -1, p })
  )

  renderedCbs.add(() => viewerSend({ type: 'RENDERED' }))
}

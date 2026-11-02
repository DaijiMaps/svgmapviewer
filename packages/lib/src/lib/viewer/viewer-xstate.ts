import { useSelector } from '@xstate/react'
import { and, assign, createActor, emit, setup } from 'xstate'

import { getConfig } from '../../config'
import {
  type ResizeInfo,
  type SearchRes,
  type SvgMapViewerConfig,
  type Zoom,
  type ZoomInfo,
  type ZoomSync,
} from '../../types'
import { boxCenter, type BoxBox } from '../box/prefixed'
import { actionCbs } from '../event-action'
import { floorCbs, notifyFloor } from '../event-floor'
import { globalCbs } from '../event-global'
import { notifyScroll, scrollCbs } from '../event-scroll'
import { notifySearch, searchCbs } from '../event-search'
import { notifyStyle, styleCbs } from '../event-style'
import { touchCbs } from '../event-touch'
import { notifyUi, uiCbs } from '../event-ui'
import type { VecVec } from '../vec/prefixed'
import { animationDone, calcAnimation, setZooming } from './layout/animation'
import type { AnimationReq } from './layout/animation-types'
import { emptyLayout } from './layout/layout'
import { lockScroll, unlockScroll } from './scroll/scroll'
import {
  clearAnimation,
  emitGetScroll,
  emitSwitch,
  emitSwitchDone,
  emitSyncLayout,
  emitSyncScroll,
  emitSyncSyncScroll,
  emitZoomEnd,
  emitZoomStart,
  emitZoomSync,
  endHome,
  endZoom,
  prepareHome,
  prepareRotate,
  prepareSearch,
  prepareZoom,
  resetCursor,
  resetScroll,
  resizeLayout,
  searchEnd,
  searchStart,
  startZoom,
} from './viewer'
import { fastZoomAtom, viewerMode } from './viewer-mode'
import {
  type ReactUIEvent,
  type ResizeRequest,
  type SearchEnd,
  type SearchRequest,
  type SwitchRequest,
  type TouchEndRequest,
  type ViewerContext,
  type ViewerEmitted,
  type ViewerEvent,
  type ViewerMode,
  type ZoomRequest,
} from './viewer-types'

//// viewerMachine

const viewerMachine = setup({
  types: {} as {
    context: ViewerContext
    events: ViewerEvent
    emitted: ViewerEmitted
  },
  guards: {
    isHoming: ({ context: { animationReq } }) =>
      animationReq !== null && animationReq.type === 'home',
    isContainerRendered: () => document.querySelector('.container') !== null,
    isMapRendered: () => getConfig().isMapRendered(),
    isUiRendered: () => getConfig().isUiRendered(),
    isFastZoom: () => fastZoomAtom.get(),
  },
  actions: {
    setRendered: assign({ rendered: true }),
    //
    // scroll
    //
    emitGetScroll: emit(() => emitGetScroll()),
    emitSyncScroll: emit(({ context }) => emitSyncScroll(context)),
    emitSyncScrollSync: emit(({ context }) => emitSyncSyncScroll(context)),
    //
    // move + zoom
    //
    prepareZoom: assign(({ context }, params: ZoomRequest) =>
      prepareZoom(context, params)
    ),
    prepareHome: assign(({ context }) => prepareHome(context)),
    prepareRotate: assign(({ context }) => prepareRotate(context)),
    clearAnimation: assign(({ context }) => clearAnimation(context)),
    startZoom: assign(({ context }) => startZoom(context)),
    endZoom: assign(({ context }) => endZoom(context)),
    endZoomSync: assign(({ context }, { p, s }: Readonly<TouchEndRequest>) => {
      if (p === undefined || s === undefined) return context
      const animationReq: AnimationReq = {
        type: 'zoom.sync',
        s,
        p,
      }
      const animation = calcAnimation(animationReq, context.layout)
      const layout = animationDone(context.layout, animation)
      return endZoom({ ...context, layout, animationReq })
    }),
    endHome: assign(({ context }) => endHome(context)),
    emitZoomStart: emit(({ context }) => emitZoomStart(context)),
    emitZoomEnd: emit(({ context }) => emitZoomEnd(context)),
    emitZoomSync: emit((_, zoomSync: null | ZoomSync) =>
      emitZoomSync(zoomSync)
    ),
    //
    // layout
    //
    resetCursor: assign(({ context }) => resetCursor(context)),
    resizeLayout: assign(({ context }, params: ResizeRequest) =>
      resizeLayout(context, params)
    ),
    resetScroll: assign(({ context }) => resetScroll(context)),
    emitSyncLayout: emit(({ context }) => emitSyncLayout(context)),
    //
    // search
    //
    prepareSearch: assign(({ context }, params: SearchRequest) =>
      prepareSearch(context, params)
    ),
    emitSearchStart: emit(({ context }) => searchStart(context)),
    emitSearchEndDone: emit(({ context }, params: SearchEnd) =>
      searchEnd(context, params)
    ),
    //
    // switch
    //
    emitSwitch: emit(({ context }, params: SwitchRequest) =>
      emitSwitch(context, params)
    ),
    emitSwitchDone: emit(emitSwitchDone()),

    enterZooming: () => setZooming(true),
    exitZooming: () => setZooming(false),
    unlockScroll: () => unlockScroll(),
  },
}).createMachine({
  id: 'viewer',
  initial: 'WaitingForResizeRequest',
  context: {
    rendered: false,
    origLayout: emptyLayout,
    prevLayout: null,
    layout: emptyLayout,
    cursor: boxCenter(emptyLayout.container),
    zoom: 1,
    rotate: 0,
    animationReq: null,
    animation: null,
    syncReq: null,
  },
  states: {
    WaitingForResizeRequest: {
      on: {
        RESIZE: {
          actions: { type: 'resizeLayout', params: ({ event }) => event },
          target: 'Resizing',
        },
      },
    },
    Resizing: {
      initial: 'WaitingForMapRendered',
      onDone: 'Idle',
      states: {
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
              target: 'Appearing',
            },
          },
        },
        Appearing: {
          on: {
            'ANIMATION.END': {
              actions: 'emitZoomEnd',
              target: 'Done',
            },
          },
        },
        Done: { type: 'final' },
      },
    },
    Idle: {
      id: 'Idle',
      on: {
        RESIZE: {
          actions: [{ type: 'resizeLayout', params: ({ event }) => event }],
          target: 'Resizing',
        },
        SEARCH: {
          guard: () => lockScroll(),
          actions: { type: 'prepareSearch', params: ({ event }) => event },
          target: 'Searching',
        },
        SWITCH: {
          // switch only when viewer is idle!
          guard: () => lockScroll(),
          actions: {
            type: 'emitSwitch',
            params: ({ event }) => event,
          },
          target: 'Switching',
        },
        RECENTER: {
          guard: () => lockScroll(),
          target: 'Recentering',
        },
        SCROLL: {
          guard: ({ event }) => event.busy,
          target: 'Scrolling',
        },
        TOUCH: {
          guard: 'isFastZoom',
          target: 'Touching',
        },
        ZOOM: {
          guard: () => lockScroll(),
          actions: {
            type: 'prepareZoom',
            params: ({ event }) => event,
          },
          target: 'Zooming',
        },
        HOME: {
          guard: () => lockScroll(),
          actions: 'prepareHome',
          target: 'Zooming',
        },
        ROTATE: {
          guard: () => lockScroll(),
          actions: 'prepareRotate',
          target: 'Zooming',
        },
      },
    },
    Scrolling: {
      on: {
        SCROLL: {
          guard: ({ event }) => !event.busy,
          target: 'Idle',
        },
      },
    },
    Searching: {
      initial: 'Starting',
      onDone: 'Idle', // XXX do `Recentering' conditionally?
      entry: () => viewerMode.set('locked'),
      exit: () => viewerMode.set('panning'),
      states: {
        Starting: {
          always: {
            actions: 'emitSearchStart',
            target: 'WaitingForSearchEnd',
          },
        },
        WaitingForSearchEnd: {
          on: {
            'SEARCH.END': {
              actions: {
                type: 'emitSearchEndDone',
                params: ({ event }) => event,
              },
              target: 'WaitingForSearchDone',
            },
          },
        },
        WaitingForSearchDone: {
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
      onDone: 'Idle',
      states: {
        Animating: {
          on: {
            'SWITCH.DONE': {
              actions: 'emitSwitchDone',
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
      onDone: 'Idle',
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
              actions: 'resetScroll',
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
    Touching: {
      id: 'Touching',
      initial: 'Stopping',
      onDone: 'Idle',
      entry: () => viewerMode.set('touching'),
      exit: () => viewerMode.set('panning'),
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
              actions: 'resetScroll',
              target: 'Main',
            },
            // XXX
            // XXX
            // XXX
          },
        },
        Main: {
          on: {
            ZOOM: {
              guard: () => lockScroll(),
              actions: {
                type: 'prepareZoom',
                params: ({ event }) => event,
              },
              target: '#Zooming',
            },
            'ZOOM.SYNC': {
              actions: {
                type: 'emitZoomSync',
                params: ({ event }) => event.zoomSync,
              },
            },
            'TOUCH.END': [
              {
                guard: ({ event }) =>
                  event.p !== undefined && event.s !== undefined,
                actions: {
                  type: 'endZoomSync',
                  params: ({ event }) => event,
                },
                target: '#Syncing',
              },
              {
                target: '#Idle',
              },
            ],
          },
        },
      },
    },
    Syncing: {
      id: 'Syncing',
      initial: 'Ending',
      onDone: 'Idle',
      states: {
        Ending: {
          always: {
            actions: [
              // XXX don't emit ZOOM.END!
              // XXX don't start animation!
              'emitSyncLayout',
              // fast sync - sync scroll NOT after resize
              'emitSyncScroll',
            ],
            target: 'Rendering2',
          },
        },
        Rendering2: {
          after: {
            // XXX
            // XXX
            // XXX
            50: {
              target: 'Done',
            },
            // XXX
            // XXX
            // XXX
          },
        },
        Done: {
          entry: 'clearAnimation',
          type: 'final',
        },
      },
    },
    // fast zooming - no expand/unexpand + no RENDRED hack
    Zooming: {
      id: 'Zooming',
      initial: 'Stopping',
      onDone: 'Idle',
      entry: 'enterZooming',
      exit: ['exitZooming', 'unlockScroll'],
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
              actions: 'resetScroll',
              target: 'Starting',
            },
            // XXX
            // XXX
            // XXX
          },
        },
        Starting: {
          always: {
            actions: ['startZoom', 'emitZoomStart'],
            target: 'Ending',
          },
        },
        Ending: {
          on: {
            'ANIMATION.END': {
              actions: [
                'endZoom',
                'emitZoomEnd',
                'emitSyncLayout',
                // fast sync - sync scroll NOT after resize
                'emitSyncScroll',
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
                'endHome',
                'emitSyncLayout',
                // fast sync - sync scroll NOT after resize
                'emitSyncScroll',
              ],
              target: 'Rendering2',
            },
            {
              target: 'Rendering2',
            },
          ],
        },
        Rendering2: {
          after: {
            // XXX
            // XXX
            // XXX
            50: {
              target: 'Done',
            },
            // XXX
            // XXX
            // XXX
          },
        },
        Done: {
          entry: 'clearAnimation',
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

viewerActor.on('SEARCH.START', ({ req }) => notifySearch.start(req))
viewerActor.on('SEARCH.END.DONE', ({ res }) => {
  if (res === null) {
    viewerActor.send({ type: 'SEARCH.DONE' })
  } else {
    notifySearch.endDone(res)
    notifyUi.open(res.psvg)
  }
})
viewerActor.on('ZOOM.START', (args) => notifyStyle.zoom(args))
viewerActor.on('ZOOM.END', (end) => notifyStyle.zoom(end))
viewerActor.on('ZOOM.SYNC', (args) => notifyStyle.zoomSync(args.zoomSync))

viewerActor.on('SWITCH', ({ fidx }) => notifyFloor.select(fidx))
viewerActor.on('SWITCH.DONE', () => notifyFloor.unlock())
viewerActor.on('SYNC.LAYOUT', ({ layout, force }) =>
  notifyStyle.layout({ layout, force })
)
viewerActor.on('SCROLL.SYNC', ({ pos }) => notifyScroll.sync(pos))
viewerActor.on('SCROLL.SYNCSYNC', ({ pos }) => notifyScroll.syncSync(pos))
viewerActor.on('SCROLL.GET', () => notifyScroll.get())

////

//let pointereventmask: boolean = false
//let toucheventmask: boolean = false
export let clickeventmask: boolean = false
export let scrolleventmask: boolean = false
export let wheeleventmask: boolean = false

// 'panning' | 'touching' | 'locked'
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
    event.ev?.stopPropagation()
  }
  viewerSend(event)
}

////

export function viewerCbsStart(): void {
  floorCbs.lock.add((fidx: number) => viewerSend({ type: 'SWITCH', fidx }))
  floorCbs.selectDone.add(() => viewerSend({ type: 'SWITCH.DONE' }))

  searchCbs.end.add((res: Readonly<null | SearchRes>) =>
    viewerActor.send({ type: 'SEARCH.END', res })
  )

  //uiCbs.open.add(() => viewerMode.set('locked'))
  uiCbs.closeDone.add(() => viewerSend({ type: 'SEARCH.DONE' }))
  //uiCbs.closeDone.add(() => viewerMode.set('panning'))

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
  scrollCbs.eventTick.add(() => viewerSend({ type: 'SCROLL', busy: true }))
  scrollCbs.eventExpire.add(() => viewerSend({ type: 'SCROLL', busy: false }))

  styleCbs.resize.add(({ layout, force }: Readonly<ResizeInfo>) =>
    viewerSend({ type: 'RESIZE', layout, force })
  )
  styleCbs.mode.add(reflectMode)
  styleCbs.zoom.add((zoom: Readonly<ZoomInfo>) => {
    // q !== null => zoom start
    wheeleventmask = zoom.q !== null
  })

  actionCbs.reset.add(() => viewerSend({ type: 'HOME' }))
  actionCbs.recenter.add(() => viewerSend({ type: 'RECENTER' }))
  actionCbs.rotate.add(() => viewerSend({ type: 'ROTATE' }))
  actionCbs.zoomOut.add(() => viewerSend({ type: 'ZOOM', z: -1, p: null }))
  actionCbs.zoomIn.add(() => viewerSend({ type: 'ZOOM', z: 1, p: null }))

  touchCbs.multiStart.add(() => {
    notifyScroll.get()
    viewerSend({ type: 'TOUCH' })
  })

  touchCbs.multiEnd.add(({ p, s }: Readonly<{ p?: VecVec; s?: number }>) => {
    viewerSend({ type: 'TOUCH.END', p, s })
  })
  touchCbs.zoom.add(({ z, p, s, sync }: Zoom) => {
    if (sync !== true) {
      viewerSend({ type: 'ZOOM', z: z > 0 ? 1 : -1, p })
    }
    if (sync === true) {
      const zoomSync: null | ZoomSync =
        p !== null && s !== undefined ? { p, s } : null
      viewerSend({
        type: 'ZOOM.SYNC',
        zoomSync,
      })
    }
  })

  globalCbs.init.add((cfg: SvgMapViewerConfig) => {
    const fastZoom = cfg?.uiConfig?.fastZoom
    if (fastZoom !== undefined) fastZoomAtom.set(fastZoom)
  })
  globalCbs.rendered.add(() => viewerSend({ type: 'RENDERED' }))
}

export function useViewerValue(): string {
  return useSelector(viewerActor, (s) => JSON.stringify(s.value))
}

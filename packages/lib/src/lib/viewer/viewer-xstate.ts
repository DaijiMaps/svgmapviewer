import { createAtom, type Atom } from '@xstate/store'
import { and, assign, createActor, emit, setup } from 'xstate'

import { svgMapViewerConfig } from '../../config'
import { type ResizeInfo, type SearchRes, type Zoom } from '../../types'
import { boxCenter, type BoxBox } from '../box/prefixed'
import { actionCbs } from '../event-action'
import { floorCbs, notifyFloor } from '../event-floor'
import { globalCbs } from '../event-global'
import { notifyScroll, scrollCbs } from '../event-scroll'
import { notifySearch, searchCbs } from '../event-search'
import { notifyStyle, styleCbs } from '../event-style'
import { touchCbs } from '../event-touch'
import { notifyUi, uiCbs } from '../event-ui'
import { emptyLayout } from './layout/layout'
import {
  emitGetScroll,
  emitSwitch,
  emitSwitchDone,
  emitSyncLayout,
  emitSyncScroll,
  emitSyncSyncScroll,
  emitZoomEnd,
  emitZoomStart,
  endHome,
  endZoom,
  resetCursor,
  resetScroll,
  resizeLayout,
  searchEnd,
  searchStart,
  startZoom,
} from './viewer'
import {
  type ReactUIEvent,
  type ResizeRequest,
  type SearchEnd,
  type SearchRequest,
  type SwitchRequest,
  type ViewerContext,
  type ViewerEmitted,
  type ViewerEvent,
  type ViewerMode,
  type ZoomRequest,
} from './viewer-types'

export const viewerMode: Atom<ViewerMode> = createAtom<ViewerMode>('panning')
viewerMode.subscribe((mode: ViewerMode) => notifyStyle.mode(mode))

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
    isMapRendered: () => svgMapViewerConfig.isMapRendered(),
    isUiRendered: () => svgMapViewerConfig.isUiRendered(),
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
    prepareZoom: assign(({ context }, { z, p }: Readonly<ZoomRequest>) => {
      return {
        ...context,
        animationReq: {
          type: 'zoom',
          z,
          p: p ?? boxCenter(context.layout.container),
        },
      }
    }),
    prepareHome: assign(({ context }) => ({
      ...context,
      animationReq: { type: 'home' },
    })),
    prepareRotate: assign(({ context }) => ({
      ...context,
      animationReq: {
        type: 'rotate',
        deg: 90,
        p: boxCenter(context.layout.container),
      },
    })),
    clearAnimation: assign(({ context }) => ({
      ...context,
      animationReq: null,
    })),
    startZoom: assign(({ context }) => startZoom(context)),
    endZoom: assign(({ context }) => endZoom(context)),
    endHome: assign(({ context }) => endHome(context)),
    emitZoomStart: emit(({ context }) => emitZoomStart(context)),
    emitZoomEnd: emit(({ context }) => emitZoomEnd(context)),
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
    prepareSearch: assign({ cursor: (_, { pos }: SearchRequest) => pos }),
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
              target: 'Done',
            },
          },
        },
        Done: { type: 'final' },
      },
    },
    Idle: {
      on: {
        RESIZE: {
          actions: [{ type: 'resizeLayout', params: ({ event }) => event }],
          target: 'Resizing',
        },
        SEARCH: {
          actions: { type: 'prepareSearch', params: ({ event }) => event },
          target: 'Searching',
        },
        SWITCH: {
          // switch only when viewer is idle!
          actions: {
            type: 'emitSwitch',
            params: ({ event }) => event,
          },
          target: 'Switching',
        },
        RECENTER: {
          target: 'Recentering',
        },
        ZOOM: {
          actions: {
            type: 'prepareZoom',
            params: ({ event }) => event,
          },
          target: 'Zooming',
        },
        HOME: {
          actions: 'prepareHome',
          target: 'Zooming',
        },
        ROTATE: {
          actions: 'prepareRotate',
          target: 'Zooming',
        },
      },
    },
    Searching: {
      initial: 'Starting',
      onDone: 'Idle', // XXX do `Recentering' conditionally?
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
    // fast zooming - no expand/unexpand + no RENDRED hack
    Zooming: {
      id: 'Zooming',
      initial: 'Stopping',
      onDone: 'Idle',
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
              target: 'Done',
            },
            {
              target: 'Done',
            },
          ],
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
viewerActor.on('ZOOM.START', (args) => notifyStyle.zoomStart(args))
viewerActor.on('ZOOM.END', (end) => notifyStyle.zoomEnd(end))

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
    event.ev.stopPropagation()
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

  uiCbs.open.add(() => viewerMode.set('locked'))
  uiCbs.closeDone.add(() => viewerSend({ type: 'SEARCH.DONE' }))
  uiCbs.closeDone.add(() => viewerMode.set('panning'))

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

  actionCbs.reset.add(() => viewerSend({ type: 'HOME' }))
  actionCbs.recenter.add(() => viewerSend({ type: 'RECENTER' }))
  actionCbs.rotate.add(() => viewerSend({ type: 'ROTATE' }))
  actionCbs.zoomOut.add(() => viewerSend({ type: 'ZOOM', z: -1, p: null }))
  actionCbs.zoomIn.add(() => viewerSend({ type: 'ZOOM', z: 1, p: null }))

  touchCbs.multiStart.add(() => notifyScroll.get())
  touchCbs.multiStart.add(() => viewerMode.set('touching'))
  touchCbs.multiEnd.add(() => viewerMode.set('panning'))
  touchCbs.zoom.add(({ z, p }: Zoom) =>
    viewerSend({ type: 'ZOOM', z: z > 0 ? 1 : -1, p })
  )

  globalCbs.rendered.add(() => viewerSend({ type: 'RENDERED' }))
}

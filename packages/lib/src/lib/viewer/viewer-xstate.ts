import { createAtom } from '@xstate/store'
import { and, assign, createActor, emit, setup } from 'xstate'

import { svgMapViewerConfig } from '../../config'
import {
  type ResizeInfo,
  type SearchSvgReq,
  type SearchRes,
  type Zoom,
} from '../../types'
import { boxCenter, type BoxBox } from '../box/prefixed'
import { actionCbs } from '../event-action'
import { floorCbs, notifyFloor } from '../event-floor'
import { globalCbs } from '../event-global'
import { notifyScroll, scrollCbs } from '../event-scroll'
import { notifySearch, searchCbs } from '../event-search'
import { notifyStyle, styleCbs } from '../event-style'
import { touchCbs } from '../event-touch'
import { notifyUiOpen, notifyUiOpenDone, uiCbs } from '../event-ui'
import { type VecVec as Vec } from '../vec/prefixed'
import {
  animationDone,
  calcAnimation,
  calcAnimationRotate,
  calcAnimationZoom,
} from './layout/animation'
import { type Animation } from './layout/animation-types'
import { fromMatrixSvg } from './layout/coord'
import {
  emptyLayout,
  expandLayoutCenter,
  rotateLayout,
  scrollLayout,
  type Layout,
} from './layout/layout'
import { getCurrentScroll } from './scroll/scroll'
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
} from './viewer-types'

export const viewerMode = createAtom<ViewerMode>('panning')
viewerMode.subscribe((mode) => notifyStyle.mode(mode))

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
    calcZoomAnimation: assign({
      animation: ({ context: { animationReq, layout } }): null | Animation =>
        calcAnimation(animationReq, layout),
    }),
    updateLayoutFromZoom: assign({
      prevLayout: ({ context: { layout } }): null | Layout => layout,
      layout: ({ context: { layout, animation } }): Layout =>
        animationDone(layout, animation),
    }),
    endZoom: assign({
      prevLayout: null,
      //animationReq: null,
      animation: null,
      zoom: ({ context: { zoom, animationReq } }) =>
        zoom * calcAnimationZoom(animationReq),
      rotate: ({ context: { rotate, animationReq } }) =>
        rotate + calcAnimationRotate(animationReq),
    }),
    endHoming: assign({
      cursor: ({ context: { origLayout } }) => boxCenter(origLayout.container),
      layout: ({ context: { origLayout, rotate } }) =>
        rotateLayout(expandLayoutCenter(origLayout, EXPAND_PANNING), rotate),
    }),
    emitSyncAnimation: emit(
      ({ context: { animation } }): ViewerEmitted => ({
        type: 'SYNC.ANIMATION',
        animation,
      })
    ),
    emitZoomStart: emit(
      ({ context: { layout, zoom } }): ViewerEmitted => ({
        type: 'ZOOM.START',
        layout,
        zoom,
      })
    ),
    emitZoomEnd: emit(
      ({ context: { layout, zoom } }): ViewerEmitted => ({
        type: 'ZOOM.END',
        layout,
        zoom,
      })
    ),
    //
    // layout
    //
    resetCursor: assign({
      cursor: ({ context: { layout } }): Vec => boxCenter(layout.container),
    }),
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
    emitSyncLayout: emit(
      ({ context: { layout, rendered } }): ViewerEmitted => ({
        type: 'SYNC.LAYOUT',
        layout,
        force: rendered,
      })
    ),
    //
    // search
    //
    emitSearchStart: emit(({ context: { layout, cursor } }): ViewerEmitted => {
      const { scroll } = getCurrentScroll()
      const l = scrollLayout(layout, scroll)
      const m = fromMatrixSvg(l).inverse()
      const psvg = m.transformPoint(cursor)
      const req: SearchSvgReq = { psvg }
      return { type: 'SEARCH.START', req }
    }),
    emitSearchEndDone: emit(
      ({ context }, { res }: SearchEnd): ViewerEmitted => {
        const { scroll } = getCurrentScroll()
        const layout = scrollLayout(context.layout, scroll)
        return {
          type: 'SEARCH.END.DONE',
          res: res === null ? null : { ...res, layout },
        }
      }
    ),
    //
    // switch
    //
    emitSwitch: emit(
      (_, { fidx }: SwitchRequest): ViewerEmitted => ({ type: 'SWITCH', fidx })
    ),
    emitSwitchDone: emit((): ViewerEmitted => ({ type: 'SWITCH.DONE' })),
  },
}).createMachine({
  id: 'viewer',
  initial: 'WaitingForResizeRequest',
  context: {
    rendered: false,
    origLayout: emptyLayout,
    layout: emptyLayout,
    prevLayout: null,
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
          actions: assign({
            cursor: ({ event: { pos } }) => pos,
          }),
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
          actions: assign({
            animationReq: ({ context: { layout }, event: { z, p } }) => ({
              type: 'zoom',
              z,
              p: p ?? boxCenter(layout.container),
            }),
          }),
          target: 'Zooming',
        },
        HOME: {
          actions: assign({
            animationReq: { type: 'home' },
          }),
          target: 'Zooming',
        },
        ROTATE: {
          actions: assign({
            animationReq: ({ context: { layout } }) => ({
              type: 'rotate',
              deg: 90,
              p: boxCenter(layout.container),
            }),
          }),
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
              'calcZoomAnimation',
              'updateLayoutFromZoom',
              'emitZoomStart',
              'emitSyncAnimation',
            ],
            target: 'Ending',
          },
        },
        Ending: {
          on: {
            'ANIMATION.END': {
              actions: [
                'endZoom',
                'emitSyncLayout',
                // fast sync - sync scroll NOT after resize
                'emitSyncScroll',
                'emitZoomEnd',
                'emitSyncAnimation',
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
          entry: assign({ animationReq: null }),
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
    notifyUiOpen(res.psvg)
  }
})
viewerActor.on('ZOOM.START', (args) => notifyStyle.zoomStart(args))
viewerActor.on('ZOOM.END', (end) => notifyStyle.zoomEnd(end))

viewerActor.on('SWITCH', ({ fidx }) => notifyFloor.select(fidx))
viewerActor.on('SWITCH.DONE', () => notifyFloor.unlock())
viewerActor.on('SYNC.ANIMATION', ({ animation: a }) => {
  const matrix = a?.q ?? null
  const origin = a?.o ?? null
  if (matrix !== null) {
    notifyStyle.animation({ matrix, origin })
  }
})
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
  uiCbs.open.add(() => notifyUiOpenDone(true))
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

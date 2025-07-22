import { useSelector } from '@xstate/react'
import { assign, createActor, raise, setup } from 'xstate'
import { svgMapViewerConfig } from './config'
import {
  animationCbs,
  layoutCbs,
  modeCbs,
  zoomEndCbs,
  zoomStartCbs,
} from './event'
import { boxToViewBox2, type BoxBox } from './lib/box/prefixed'
import { findRadius } from './lib/distance'
import type { DistanceRadius } from './lib/distance-types'
import { makeExpire } from './lib/expire-xstate'
import { trunc2 } from './lib/utils'
import { vecZero, type VecVec } from './lib/vec/prefixed'
import { type Animation } from './lib/viewer/animation-types'
import { fromSvgToScroll } from './lib/viewer/coord'
import {
  emptyLayout,
  type Layout,
  type LayoutConfig,
} from './lib/viewer/layout'
import {
  getCurrentScroll,
  scrollEventCbs,
  type CurrentScroll,
} from './lib/viewer/scroll'
import type { ViewerMode } from './lib/viewer/viewer-types'
import type { Range } from './types'

type LayoutEvent = { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
type ZoomEvent = { type: 'STYLE.ZOOM'; zoom: number; z: null | number }
type ScrollEvent = { type: 'STYLE.SCROLL'; currentScroll: CurrentScroll } // p == pscroll
type ModeEvent = { type: 'STYLE.MODE'; mode: string }
type AnimationEvent = { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
type AnimationEndEvent = { type: 'STYLE.ANIMATION.END' } // null to stop animation
type LayoutDoneEvent = { type: 'LAYOUT.DONE'; rendered: boolean } // internal
export type StyleEvent =
  | LayoutEvent
  | ZoomEvent
  | ScrollEvent
  | ModeEvent
  | AnimationEvent
  | AnimationEndEvent
  | LayoutDoneEvent

interface StyleContext {
  rendered: boolean
  appearing: boolean
  shown: boolean
  animating: boolean
  layout: Layout
  zoom: number
  z: null | number
  rotate: null | number
  svgMatrix: DOMMatrixReadOnly
  geoMatrix: DOMMatrixReadOnly
  geoPoint: VecVec
  distanceRadius: DistanceRadius
  geoRange: Range
  mode: string
  animation: null | Animation
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
  actions: {
    updateZoom: assign({
      zoom: (_, ev: ZoomEvent) => ev.zoom,
      z: (_, ev: ZoomEvent) => ev.z,
    }),
    updateRotate: assign({}),
    updateSvgMatrix: assign({
      svgMatrix: ({ context: { layout } }) => fromSvgToScroll(layout),
    }),
    updateGeoMatrix: assign({
      geoMatrix: ({ context }) =>
        context.svgMatrix
          .multiply(svgMapViewerConfig.mapCoord.matrix)
          .inverse(),
    }),
    updateDistanceRadius: assign({
      distanceRadius: ({ context: { layout } }) => findRadius(layout),
    }),
    updateScroll: assign({
      geoPoint: ({ context }, { scroll, client }: CurrentScroll) => {
        const m = context.geoMatrix
        const p = {
          x: scroll.x + client.width / 2,
          y: scroll.y + client.height / 2,
        }
        return m.transformPoint(p)
      },
      geoRange: ({ context }, { scroll, client }: CurrentScroll) => {
        const m = context.geoMatrix
        const s = { x: scroll.x, y: scroll.y }
        const e = { x: scroll.x + client.width, y: scroll.y + client.height }
        const start = m.transformPoint(s)
        const end = m.transformPoint(e)
        return {
          start,
          end,
        }
      },
    }),
  },
}).createMachine({
  id: 'style1',
  context: {
    rendered: true,
    appearing: false,
    shown: false,
    animating: false,
    layout: emptyLayout,
    zoom: 1,
    z: null,
    rotate: null,
    svgMatrix: new DOMMatrixReadOnly(),
    geoMatrix: new DOMMatrixReadOnly(),
    geoPoint: vecZero,
    distanceRadius: {
      svg: 0,
      client: 0,
    },
    geoRange: {
      start: vecZero,
      end: vecZero,
    },
    mode: 'panning',
    animation: null,
  },
  on: {
    'STYLE.LAYOUT': {
      actions: [
        assign({
          rendered: ({ event }) => event.rendered,
          layout: ({ event }) => event.layout,
        }),
        'updateSvgMatrix',
        'updateGeoMatrix',
        'updateDistanceRadius',
        raise(({ event: { rendered } }) => ({ type: 'LAYOUT.DONE', rendered })),
      ],
    },
    'STYLE.ZOOM': {
      actions: {
        type: 'updateZoom',
        params: ({ event }) => event,
      },
    },
    'STYLE.SCROLL': {
      actions: {
        type: 'updateScroll',
        params: ({ event }) => event.currentScroll,
      },
    },
    'STYLE.MODE': {
      actions: assign({
        mode: ({ event }) => event.mode,
      }),
    },
  },
  initial: 'WaitingForLayout',
  states: {
    WaitingForLayout: {
      on: {
        'LAYOUT.DONE': {
          guard: ({ event }) => event.rendered,
          actions: assign({ appearing: true }),
          target: 'Appearing',
        },
      },
    },
    Appearing: {
      on: {
        'STYLE.ANIMATION.END': {
          actions: assign({ appearing: false, shown: true }),
          target: 'Idle',
        },
      },
    },
    Idle: {
      on: {
        'STYLE.ANIMATION': {
          actions: assign({
            animation: ({ event }) => event.animation,
            animating: true,
          }),
          target: 'Animating',
        },
        'LAYOUT.DONE': {
          guard: ({ event }) => !event.rendered,
          actions: assign({ shown: false }),
          target: 'WaitingForLayout',
        },
      },
    },
    Animating: {
      on: {
        'STYLE.ANIMATION.END': {
          actions: assign({
            animation: null,
            animating: false,
          }),
          target: 'Idle',
        },
      },
    },
  },
})

const styleActor = createActor(styleMachine, {
  systemId: 'system-viewer1',
  //inspect: (iev) => console.log('style', iev),
})
styleActor.start()

export function styleActorStart(): void {
  styleActor.start()
}

export function styleSend(ev: StyleEvent): void {
  styleActor.send(ev)
}

export function styleAnimationEnd(): void {
  styleActor.send({ type: 'STYLE.ANIMATION.END' })
}

//// selectors

export function useRendered(): boolean {
  return useSelector(styleActor, (s) => s.context.rendered)
}
export function useAppearing(): boolean {
  return useSelector(styleActor, (s) => s.context.appearing)
}
export function useShown(): boolean {
  return useSelector(styleActor, (s) => s.context.shown)
}
export function useAnimating(): boolean {
  return useSelector(styleActor, (s) => s.context.animating)
}
export function useLayout(): Layout {
  return useSelector(styleActor, (s) => s.context.layout)
}
export function useLayoutContainer(): BoxBox {
  return useSelector(styleActor, (s) => s.context.layout.container)
}
export function useLayoutScroll(): BoxBox {
  return useSelector(styleActor, (s) => s.context.layout.scroll)
}
export function useMode(): string {
  return useSelector(styleActor, (s) => s.context.mode)
}
export function useAnimation(): null | Animation {
  return useSelector(styleActor, (s) => s.context.animation)
}
export function useGeoPoint(): VecVec {
  return useSelector(styleActor, (s) => s.context.geoPoint)
}
export function useDistanceRadius(): DistanceRadius {
  return useSelector(styleActor, (s) => s.context.distanceRadius)
}
export function useSvgRange(): Range {
  return useSelector(styleActor, (s) => s.context.geoRange)
}
export function useLayoutConfig(): LayoutConfig {
  return useSelector(styleActor, (state) => state.context.layout.config)
}
export function useLayoutSvgScaleS(): number {
  return useSelector(styleActor, (state) => state.context.layout.svgScale.s)
}
export function useLayoutContent(): DOMMatrixReadOnly {
  return useSelector(styleActor, (state) => state.context.layout.content)
}
export function useZoom(): number {
  return useSelector(styleActor, (state) => state.context.zoom)
}
export function useRotate(): null | number {
  return useSelector(styleActor, (state) => state.context.rotate)
}
export function useLayout2(): {
  viewBox: string
  width: number
  height: number
} {
  const { scroll, svg } = useSelector(styleActor, (s) => s.context.layout)

  return {
    viewBox: boxToViewBox2(svg),
    width: trunc2(scroll.width),
    height: trunc2(scroll.height),
  }
}

// handlers

function handleLayout(layout: Layout, rendered: boolean) {
  styleSend({ type: 'STYLE.LAYOUT', layout, rendered })
  // XXX update name range after scroll is updated
  requestAnimationFrame(() => handleExpire())
}
function handleZoomStart(_: Layout, zoom: number, z: number) {
  styleSend({ type: 'STYLE.ZOOM', zoom, z })
}
function handleZoomEnd(_: Layout, zoom: number) {
  styleSend({ type: 'STYLE.ZOOM', zoom, z: null })
}
function handleAnimation(animation: null | Animation) {
  styleSend({ type: 'STYLE.ANIMATION', animation })
}
function handleMode(mode: ViewerMode) {
  styleSend({ type: 'STYLE.MODE', mode })
}

layoutCbs.add(handleLayout)
zoomStartCbs.add(handleZoomStart)
zoomEndCbs.add(handleZoomEnd)
animationCbs.add(handleAnimation)
modeCbs.add(handleMode)

// scroll & expire

function handleExpire() {
  const currentScroll = getCurrentScroll()
  styleSend({ type: 'STYLE.SCROLL', currentScroll })
}

const expire = makeExpire(500, handleExpire)

scrollEventCbs.add(expire.tick)

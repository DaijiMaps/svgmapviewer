import { useSelector } from '@xstate/react'
import { assign, createActor, raise, setup } from 'xstate'
import {
  animationCbs,
  layoutCbs,
  svgMapViewerConfig,
  zoomEndCbs,
  zoomStartCbs,
} from './config'
import { boxToViewBox2, type BoxBox } from './lib/box/prefixed'
import { findRadius } from './lib/distance'
import type { DistanceRadius } from './lib/distance-types'
import { makeExpire } from './lib/expire-xstate'
import type { Cb } from './lib/types'
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

type ZoomEvent = { type: 'STYLE.ZOOM'; zoom: number; z: null | number }
export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
  | { type: 'STYLE.SCROLL'; currentScroll: CurrentScroll } // p == pscroll
  | { type: 'STYLE.ANIMATION.END' } // null to stop animation
  | { type: 'LAYOUT.DONE'; rendered: boolean } // internal
  | ZoomEvent

export interface Range {
  start: VecVec
  end: VecVec
}

interface StyleContext {
  rendered: boolean
  appearing: boolean
  shown: boolean
  animating: boolean
  layout: Layout
  zoom: number
  z: null | number
  svgMatrix: DOMMatrixReadOnly
  geoMatrix: DOMMatrixReadOnly
  geoPoint: VecVec
  distanceRadius: DistanceRadius
  svgRange: Range
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
        const p = {
          x: scroll.x + client.width / 2,
          y: scroll.y + client.height / 2,
        }
        return context.geoMatrix.transformPoint(p)
      },
      svgRange: ({ context }, { scroll, client }: CurrentScroll) => {
        const s = { x: scroll.x, y: scroll.y }
        const e = { x: scroll.x + client.width, y: scroll.y + client.height }
        const m = context.svgMatrix.inverse()
        return {
          start: m.transformPoint(s),
          end: m.transformPoint(e),
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
    svgMatrix: new DOMMatrixReadOnly(),
    geoMatrix: new DOMMatrixReadOnly(),
    geoPoint: vecZero,
    distanceRadius: {
      svg: 0,
      client: 0,
    },
    svgRange: {
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
export function useSvgMatrix(): DOMMatrixReadOnly {
  return useSelector(styleActor, (s) => s.context.svgMatrix)
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
  return useSelector(styleActor, (s) => s.context.svgRange)
}
export function useLayoutConfig(): LayoutConfig {
  return useSelector(styleActor, (state) => state.context.layout.config)
}
export function useLayoutSvgScaleS(): number {
  return useSelector(styleActor, (state) => state.context.layout.svgScale.s)
}
export function useZoom(): number {
  return useSelector(styleActor, (state) => state.context.zoom)
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

function handleLayout(layout: Layout, rendered: boolean) {
  styleSend({ type: 'STYLE.LAYOUT', layout, rendered })
  // XXX update name range after scroll is updated
  requestAnimationFrame(() => expireCb())
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

layoutCbs.add(handleLayout)
zoomStartCbs.add(handleZoomStart)
zoomEndCbs.add(handleZoomEnd)
animationCbs.add(handleAnimation)

// scroll & expire

function expireCb() {
  const currentScroll = getCurrentScroll()
  styleSend({ type: 'STYLE.SCROLL', currentScroll })
}

const expire = makeExpire(500, expireCb)
expire.start()

scrollEventCbs.add(expire.tick)

// rendered

export const renderedCbs: Set<Cb> = new Set()

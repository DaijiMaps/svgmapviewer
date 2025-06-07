import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { type Animation } from './animation'
import { svgMapViewerConfig } from './config'
import { registerCbs } from './config-xstate'
import { fromSvgToScroll } from './coord'
import { findRadius } from './distance'
import type { DistanceRadius } from './distance-types'
import { emptyLayout, type Layout } from './layout'
import type { VecVec } from './vec/prefixed'

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
  | { type: 'STYLE.LONLAT'; p: VecVec } // p == pscroll
  | { type: 'ANIMATION.END' } // null to stop animation

interface StyleContext {
  rendered: boolean
  animating: boolean
  layout: Layout
  svgMatrix: DOMMatrixReadOnly
  geoMatrix: DOMMatrixReadOnly
  distanceRadius: DistanceRadius
  dragging: boolean
  mode: string
  animation: null | Animation
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
  actions: {
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
    setLonLat: ({ context }, { p }: { p: VecVec }) => {
      // p == pscroll
      const pgeo = context.geoMatrix.transformPoint(p)

      const lon = document.querySelector('#longitude')
      const lat = document.querySelector('#latitude')
      const ew = pgeo.x > 0 ? 'E' : 'W'
      const ns = pgeo.y > 0 ? 'N' : 'S'
      if (lon !== null && lat !== null) {
        lon.innerHTML = `${ew} ${truncate7(Math.abs(pgeo.x))}`
        lat.innerHTML = `${ns} ${truncate7(Math.abs(pgeo.y))}`
      }
    },
    setDistance: ({ context }) => {
      const { svg } = context.distanceRadius
      for (let i = 1; i < 20; i++) {
        const dx = document.querySelector(`#distance-x-${i}`)
        const dy = document.querySelector(`#distance-y-${i}`)
        if (dx !== null && dy !== null) {
          dx.innerHTML = `${svg * i}m`
          dy.innerHTML = `${svg * i}m`
        }
      }
    },
  },
}).createMachine({
  id: 'style1',
  context: {
    rendered: true,
    animating: false,
    layout: emptyLayout,
    svgMatrix: new DOMMatrixReadOnly(),
    geoMatrix: new DOMMatrixReadOnly(),
    distanceRadius: {
      svg: 0,
      client: 0,
    },
    dragging: false,
    mode: 'panning',
    animation: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.LAYOUT': {
          actions: [
            assign({
              rendered: ({ event }) => event.rendered,
              animating: ({ context, event }) =>
                // if animating, don't change (animating is cleared only by 'ANIMATION.END')
                context.animating ||
                // if not animating, transition from !rendered to rendered triggers opacity animation
                (!context.rendered && event.rendered && !context.animating),
              layout: ({ event }) => event.layout,
            }),
            'updateSvgMatrix',
            'updateGeoMatrix',
            'updateDistanceRadius',
            'setDistance',
          ],
        },
        'STYLE.DRAGGING': {
          actions: assign({
            dragging: ({ event }) => event.dragging,
          }),
        },
        'STYLE.MODE': {
          actions: assign({
            mode: ({ event }) => event.mode,
          }),
        },
        'STYLE.ANIMATION': {
          actions: assign({
            animation: ({ event }) => event.animation,
          }),
        },
        'STYLE.LONLAT': {
          actions: {
            type: 'setLonLat',
            params: ({ event }) => ({ p: event.p }),
          },
        },
        'ANIMATION.END': {
          actions: assign({
            animating: () => false,
          }),
        },
      },
    },
  },
})

function truncate7(n: number): number {
  return Math.round(n * 10000000) / 10000000
}

const styleActor = createActor(styleMachine, {
  systemId: 'system-viewer1',
  //inspect: (iev) => console.log('style', iev),
})
styleActor.start()

//type StyleMachine = typeof styleMachine
//type StyleState = StateFrom<StyleMachine>

export function styleActorStart(): void {
  styleActor.start()
}

export function styleSend(ev: StyleEvent): void {
  styleActor.send(ev)
}

export function styleAnimationEnd(): void {
  styleActor.send({ type: 'ANIMATION.END' })
}

export function useRendered(): boolean {
  return useSelector(styleActor, (s) => s.context.rendered)
}
export function useAnimating(): boolean {
  return useSelector(styleActor, (s) => s.context.animating)
}
export function useLayout(): Layout {
  return useSelector(styleActor, (s) => s.context.layout)
}
export function useSvgMatrix(): DOMMatrixReadOnly {
  return useSelector(styleActor, (s) => s.context.svgMatrix)
}
export function useDragging(): boolean {
  return useSelector(styleActor, (s) => s.context.dragging)
}
export function useMode(): string {
  return useSelector(styleActor, (s) => s.context.mode)
}
export function useAnimation(): null | Animation {
  return useSelector(styleActor, (s) => s.context.animation)
}
export function useDistanceRadius(): DistanceRadius {
  return useSelector(styleActor, (s) => s.context.distanceRadius)
}

registerCbs({
  layoutCb: (layout, rendered) =>
    styleSend({ type: 'STYLE.LAYOUT', layout, rendered }),
})

import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { type Animation } from './animation-types'
import type { BoxBox } from './box/prefixed'
import { svgMapViewerConfig } from './config'
import { registerCbs } from './config-xstate'
import { fromSvgToScroll } from './coord'
import { findRadius } from './distance'
import type { DistanceRadius } from './distance-types'
import { emptyLayout, type Layout } from './layout'
import { UI_ROOT_ID } from './ui-react'
import { trunc7 } from './utils'
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
      const root = document.querySelector(`#${UI_ROOT_ID}`)?.shadowRoot
      if (!root) {
        return
      }
      // p == pscroll
      const pgeo = context.geoMatrix.transformPoint(p)
      const lon = root.querySelector('#longitude')
      const lat = root.querySelector('#latitude')
      const ew = pgeo.x > 0 ? 'E' : 'W'
      const ns = pgeo.y > 0 ? 'N' : 'S'
      if (!!lon && !!lat) {
        lon.innerHTML = `${ew} ${trunc7(Math.abs(pgeo.x))}`
        lat.innerHTML = `${ns} ${trunc7(Math.abs(pgeo.y))}`
      }
    },
    setDistance: ({ context }) => {
      const root = document.querySelector(`#${UI_ROOT_ID}`)?.shadowRoot
      if (!root) {
        return
      }
      const { svg } = context.distanceRadius
      for (let i = 1; i < 20; i++) {
        const dx = root.querySelector(`#distance-x-${i}`)
        const dy = root.querySelector(`#distance-y-${i}`)
        if (!!dx && !!dy) {
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
export function useLayoutContainer(): BoxBox {
  return useSelector(styleActor, (s) => s.context.layout.container)
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
  animationCb: (animation) => styleSend({ type: 'STYLE.ANIMATION', animation }),
})

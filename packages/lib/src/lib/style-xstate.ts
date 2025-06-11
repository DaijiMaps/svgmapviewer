import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { type Animation } from './animation-types'
import type { BoxBox } from './box/prefixed'
import { svgMapViewerConfig } from './config'
import { registerCbs } from './config-xstate'
import { fromSvgToScroll } from './coord'
import { findRadius } from './distance'
import type { DistanceRadius } from './distance-types'
import { makeExpire } from './expire-xstate'
import { emptyLayout, type Layout } from './layout'
import { getCurrentScroll, scrollEventCbs, type CurrentScroll } from './scroll'
import { trunc7 } from './utils'
import { vecZero, type VecVec } from './vec/prefixed'

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
  | { type: 'STYLE.SCROLL'; currentScroll: CurrentScroll } // p == pscroll
  | { type: 'ANIMATION.END' } // null to stop animation

export interface LonLat {
  lon: string
  lat: string
}

export interface Range {
  start: VecVec
  end: VecVec
}

interface StyleContext {
  rendered: boolean
  animating: boolean
  layout: Layout
  svgMatrix: DOMMatrixReadOnly
  geoMatrix: DOMMatrixReadOnly
  lonLat: LonLat
  distanceRadius: DistanceRadius
  svgRange: Range
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
    setLonLat: assign({
      lonLat: ({ context }, { scroll, client }: CurrentScroll) => {
        const p = {
          x: scroll.x + client.width / 2,
          y: scroll.y + client.height / 2,
        }
        const pgeo = context.geoMatrix.transformPoint(p)
        const ew = pgeo.x > 0 ? 'E' : 'W'
        const ns = pgeo.y > 0 ? 'N' : 'S'
        const lon = `${ew} ${trunc7(Math.abs(pgeo.x))}`
        const lat = `${ns} ${trunc7(Math.abs(pgeo.y))}`
        return { lon, lat }
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
    animating: false,
    layout: emptyLayout,
    svgMatrix: new DOMMatrixReadOnly(),
    geoMatrix: new DOMMatrixReadOnly(),
    lonLat: { lon: '', lat: '' },
    distanceRadius: {
      svg: 0,
      client: 0,
    },
    svgRange: {
      start: vecZero,
      end: vecZero,
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
        'STYLE.SCROLL': {
          actions: [
            {
              type: 'setLonLat',
              params: ({ event }) => event.currentScroll,
            },
            // XXX updateRange
          ],
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
export function useLonLat(): LonLat {
  return useSelector(styleActor, (s) => s.context.lonLat)
}
export function useDistanceRadius(): DistanceRadius {
  return useSelector(styleActor, (s) => s.context.distanceRadius)
}
export function useSvgRange(): Range {
  return useSelector(styleActor, (s) => s.context.svgRange)
}

registerCbs({
  layoutCb: (layout, rendered) => {
    styleSend({ type: 'STYLE.LAYOUT', layout, rendered })
    // XXX update name range after scroll is updated
    requestAnimationFrame(() => expireCb())
  },
  animationCb: (animation) => styleSend({ type: 'STYLE.ANIMATION', animation }),
})

// scroll & expire

function expireCb() {
  const currentScroll = getCurrentScroll()
  styleSend({ type: 'STYLE.SCROLL', currentScroll })
}

const expire = makeExpire(500, expireCb)

scrollEventCbs.add(expire.tick)

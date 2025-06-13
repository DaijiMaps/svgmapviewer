import { useSelector } from '@xstate/react'
import { assign, createActor, raise, setup } from 'xstate'
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
import { vecZero, type VecVec } from './vec/prefixed'

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
  | { type: 'STYLE.SCROLL'; currentScroll: CurrentScroll } // p == pscroll
  | { type: 'STYLE.ANIMATION.END' } // null to stop animation
  | { type: 'LAYOUT.DONE' } // internal

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
    animating: false,
    layout: emptyLayout,
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
        raise({ type: 'LAYOUT.DONE' }),
      ],
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
expire.start()

scrollEventCbs.add(expire.tick)

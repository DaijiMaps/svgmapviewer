import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { type Animation } from './animation'
import { svgMapViewerConfig } from './config'
import { fromMatrixSvg } from './coord'
import { emptyLayout, type Layout } from './layout'
import type { VecVec } from './vec/prefixed'

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
  | { type: 'STYLE.LONLAT'; p: VecVec }
  | { type: 'ANIMATION.END' } // null to stop animation

interface StyleContext {
  rendered: boolean
  animating: boolean
  layout: Layout
  dragging: boolean
  mode: string
  animation: null | Animation
  scrollToGeo: null | DOMMatrixReadOnly
  lonlat: null | VecVec
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
  actions: {
    setLonLat: ({ context }) => {
      if (context.lonlat === null) {
        return
      }
      // XXX scroll event + currentTarget
      // XXX x: scrollLeft + clientWidth / 2
      // XXX y: scrollTop + clientHeight / 2
      // XXX scroll -> svg -> geo
      // XXX DOMMatrix
      const m = fromMatrixSvg(context.layout).inverse()
      const psvg = m.transformPoint(context.lonlat)
      const m2 = svgMapViewerConfig.mapCoord.matrix.inverse()
      const pgeo = m2.transformPoint(psvg)

      const lon = document.querySelector('#longitude')
      const lat = document.querySelector('#latitude')
      if (lon !== null && lat !== null) {
        lon.innerHTML = `E ${pgeo.x}`
        lat.innerHTML = `N ${pgeo.y}`
      }
    },
  },
}).createMachine({
  id: 'style1',
  context: {
    rendered: true,
    animating: false,
    layout: emptyLayout,
    dragging: false,
    mode: 'panning',
    animation: null,
    scrollToGeo: null,
    lonlat: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.LAYOUT': {
          actions: assign({
            rendered: ({ event }) => event.rendered,
            animating: ({ context, event }) =>
              // if animating, don't change (animating is cleared only by 'ANIMATION.END')
              context.animating ||
              // if not animating, transition from !rendered to rendered triggers opacity animation
              (!context.rendered && event.rendered && !context.animating),
            layout: ({ event }) => event.layout,
            // XXX
            // XXX
            // XXX
            scrollToGeo: null,
            // XXX
            // XXX
            // XXX
          }),
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
          actions: [
            assign({
              lonlat: ({ event }) => event.p,
            }),
            'setLonLat',
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
export function useDragging(): boolean {
  return useSelector(styleActor, (s) => s.context.dragging)
}
export function useMode(): string {
  return useSelector(styleActor, (s) => s.context.mode)
}
export function useAnimation(): null | Animation {
  return useSelector(styleActor, (s) => s.context.animation)
}

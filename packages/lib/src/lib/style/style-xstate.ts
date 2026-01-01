import { useSelector } from '@xstate/react'
import { assign, createActor, raise, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import {
  type AnimationMatrix,
  type CurrentScroll,
  type ResizeInfo,
  type ZoomEndInfo,
  type ZoomInfo,
} from '../../types'
import { findRadius } from '../distance'
import { scrollCbs } from '../event-scroll'
import { styleCbs } from '../event-style'
import { vecZero } from '../vec/prefixed'
import { fromSvgToScroll } from '../viewer/layout/coord'
import { emptyLayout, type Layout } from '../viewer/layout/layout'
import { getCurrentScroll } from '../viewer/scroll/scroll'
import { type ViewerMode } from '../viewer/viewer-types'
import type { StyleContext, StyleEvent, ZoomEvent } from './style-types'
import { createAtom } from '@xstate/store'

export const currentLayout = createAtom<Layout>(emptyLayout)

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
        ({ event }) => currentLayout.set(event.layout),
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
            animation: ({ event: { animation } }) => animation,
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

export function styleActorStart(): void {
  styleActor.start()
}

export function styleSend(ev: StyleEvent): void {
  styleActor.send(ev)
}

export function useStyleContext<T>(f: (s: StyleContext) => T): T {
  return useSelector(styleActor, (s) => f(s.context))
}

// handlers

function handleExpire(): void {
  const currentScroll = getCurrentScroll()
  styleSend({ type: 'STYLE.SCROLL', currentScroll })
}

export function styleCbsStart(): void {
  styleCbs.layout.add(function ({ layout, force }: Readonly<ResizeInfo>) {
    styleSend({ type: 'STYLE.LAYOUT', layout, rendered: force })
    // XXX update name range after scroll is updated
    requestAnimationFrame(() => handleExpire())
  })
  styleCbs.zoomStart.add(function (zoom: Readonly<ZoomInfo>) {
    styleSend({ type: 'STYLE.ZOOM', ...zoom })
  })
  styleCbs.zoomEnd.add(function (end: Readonly<ZoomEndInfo>) {
    styleSend({ type: 'STYLE.ZOOM', zoom: end.zoom, z: null })
  })
  styleCbs.animation.add(function (animation: null | AnimationMatrix) {
    styleSend({ type: 'STYLE.ANIMATION', animation })
  })
  styleCbs.animationEnd.add(function () {
    styleSend({ type: 'STYLE.ANIMATION.END' })
  })
  styleCbs.mode.add(function (mode: ViewerMode) {
    styleSend({ type: 'STYLE.MODE', mode })
  })

  scrollCbs.eventExpire.add(handleExpire)
}

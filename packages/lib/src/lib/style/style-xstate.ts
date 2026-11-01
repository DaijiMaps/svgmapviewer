import { useSelector } from '@xstate/react'
import { createAtom, type Atom } from '@xstate/store'
import { assign, createActor, raise, setup } from 'xstate'

import { getConfig } from '../../config'
import { appendDebug } from '../../debug'
import {
  type CurrentScroll,
  type ResizeInfo,
  type ZoomInfo,
  type ZoomSync,
} from '../../types'
import { findRadius } from '../distance'
import { scrollCbs } from '../event-scroll'
import { styleCbs } from '../event-style'
import { updateMapStyleRefs } from '../map/style'
import {
  updateCoordRefs,
  updateDistanceRefs,
  updateMeasureRefs,
} from '../ui/Measure'
import { vecZero } from '../vec/prefixed'
import { fromSvgToScroll } from '../viewer/layout/coord'
import { emptyLayout, type Layout } from '../viewer/layout/layout'
import {
  updateSvgScaleStyleRefs,
  updateZoomStyleRefs,
  updateZoomSyncStyleRefs,
} from '../viewer/layout/style'
import { updateLayoutStyleRefs } from '../viewer/layout/style'
import { getCurrentScroll } from '../viewer/scroll/scroll'
import { updateAppearingStyleRefs } from './appearing'
import { startLoop } from './frame'
import type { StyleContext, StyleEvent, ZoomEvent } from './style-types'
//import { appendDebug } from '../../debug'

export const currentLayout: Atom<Layout> = createAtom<Layout>(emptyLayout)

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
  actions: {
    updateZoom: assign({
      zoom: (_, ev: ZoomEvent) => ev.zoom,
    }),
    updateRotate: assign({}),
    updateSvgMatrix: assign({
      svgMatrix: ({ context: { layout } }) => fromSvgToScroll(layout),
    }),
    updateGeoMatrix: assign({
      geoMatrix: ({ context }) =>
        context.svgMatrix.multiply(getConfig().mapCoord.matrix).inverse(),
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
    updateCoord: ({ context: { geoPoint } }) => updateCoordRefs(geoPoint),
    updateDistance: ({ context: { distanceRadius } }) =>
      updateDistanceRefs(distanceRadius),
    updateMeasure: ({ context: { layout, distanceRadius } }) =>
      updateMeasureRefs(
        layout.container.width,
        layout.container.height,
        distanceRadius.client
      ),
  },
}).createMachine({
  id: 'style1',
  context: {
    rendered: true,
    appearing: false,
    shown: false,
    layout: emptyLayout,
    zoom: 1,
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
        'updateDistance',
        'updateMeasure',
        raise(({ event: { rendered } }) => ({ type: 'LAYOUT.DONE', rendered })),
        ({ context }) => updateLayoutStyleRefs(context.layout),
        ({ context }) => updateSvgScaleStyleRefs(context.layout),
        ({ context }) => updateMapStyleRefs(context.layout, context.zoom),
      ],
    },
    'STYLE.ZOOM': {
      actions: [
        {
          type: 'updateZoom',
          params: ({ event }) => event,
        },
        ({ context: { zoom } }) => updateZoomStyleRefs(null, zoom),
      ],
    },
    'STYLE.SCROLL': {
      actions: [
        {
          type: 'updateScroll',
          params: ({ event }) => event.currentScroll,
        },
        'updateCoord',
      ],
    },
  },
  initial: 'WaitingForLayout',
  entry: ({ context }) =>
    updateAppearingStyleRefs(context.shown, context.appearing),
  states: {
    WaitingForLayout: {
      on: {
        'LAYOUT.DONE': {
          guard: ({ event }) => event.rendered,
          actions: [
            assign({ appearing: true }),
            ({ context }) =>
              updateAppearingStyleRefs(context.shown, context.appearing),
            //() => requestAnimationFrame(() => notifyGlobal.rendered()),
          ],
          target: 'Appearing',
        },
      },
    },
    Appearing: {
      on: {
        'STYLE.ANIMATION.END': {
          actions: [
            assign({ appearing: false, shown: true }),
            ({ context: { zoom } }) => updateZoomStyleRefs(null, zoom),
            ({ context }) =>
              updateAppearingStyleRefs(context.shown, context.appearing),
            // after initial rendering
            'updateDistance',
            'updateMeasure',
          ],
          target: 'Idle',
        },
      },
    },
    Idle: {
      on: {
        'STYLE.ANIMATION': {
          actions: [
            ({ context: { zoom }, event: { animation } }) =>
              updateZoomStyleRefs(animation, zoom),
            () => startLoop('zoom', 500),
          ],
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
          actions: ({ context: { zoom } }) => updateZoomStyleRefs(null, zoom),
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
  styleCbs.zoom.add(function (zoom: Readonly<ZoomInfo>) {
    appendDebug(`style zoom: zoom=${JSON.stringify(zoom.zoom)} q=${zoom.q}`)
    styleSend({ type: 'STYLE.ZOOM', zoom: zoom.zoom })
    styleSend({ type: 'STYLE.ANIMATION', animation: zoom.q })
  })
  styleCbs.zoomSync.add(function (zoomSync: Readonly<null | ZoomSync>) {
    if (zoomSync === null) {
      appendDebug(`zoomSync null!`)
      updateZoomSyncStyleRefs(null, null)
    } else {
      updateZoomSyncStyleRefs(zoomSync.p, zoomSync.s)
    }
  })
  styleCbs.animationEnd.add(function () {
    styleSend({ type: 'STYLE.ANIMATION.END' })
  })

  scrollCbs.eventExpire.add(handleExpire)

  // XXX listen to styleCbs.zoomSync from viewer
  /*
  touchCbs.zoom.add(function (zoom: Readonly<Zoom>) {
    if (!zoom.sync) return
    if (zoom.p !== null && zoom.s !== undefined) {
      updateZoomSyncStyleRefs(zoom.p, zoom.s)
    } else if (zoom.p === null && zoom.s === 1) {
      updateZoomSyncStyleRefs(null, null)
    }
  })
  */
}

export function useStyleValue(): string {
  return useSelector(styleActor, (s) => JSON.stringify(s.value))
}

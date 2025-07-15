import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { registerCbs } from '../config-xstate'
import { emptyLayout } from '../layout'
import { type Layout, type LayoutConfig } from '../layout-types'
import type { RenderMapContext, RenderMapEvent } from './map-types'

const renderMapMachine = setup({
  types: {
    input: {} as { layout: Layout },
    context: {} as RenderMapContext,
    events: {} as RenderMapEvent,
  },
}).createMachine({
  id: 'render-map',
  context: ({ input: { layout } }) => ({
    layout: layout,
    zoom: 1,
    z: null,
  }),
  on: {
    ZOOM: {
      actions: [
        assign({
          layout: ({ event: { layout } }) => layout,
          zoom: ({ event: { zoom } }) => zoom,
          z: ({ event: { z } }) => z,
        }),
      ],
    },
    LAYOUT: {
      actions: [
        assign({
          layout: ({ event: { layout } }) => layout,
        }),
      ],
    },
  },
})

export function useLayoutConfig(): LayoutConfig {
  return useSelector(renderMapActor, (state) => state.context.layout.config)
}
export function useLayoutSvgScaleS(): number {
  return useSelector(renderMapActor, (state) => state.context.layout.svgScale.s)
}
export function useZoom(): number {
  return useSelector(renderMapActor, (state) => state.context.zoom)
}

////

const renderMapActor = createActor(renderMapMachine, {
  input: {
    layout: emptyLayout,
  },
})
export function renderMapActorStart(): void {
  renderMapActor.start()
}
export function renderMapActorSend(ev: RenderMapEvent): void {
  renderMapActor.send(ev)
}
renderMapActor.start()

function renderMapZoomStart(layout: Readonly<Layout>, zoom: number, z: number) {
  renderMapActorSend({ type: 'ZOOM', layout, zoom, z })
}
function renderMapZoomEnd(layout: Readonly<Layout>, zoom: number) {
  renderMapActorSend({ type: 'ZOOM', layout, zoom, z: null })
}
function renderMapLayout(layout: Layout) {
  renderMapActorSend({ type: 'LAYOUT', layout })
}

registerCbs({
  zoomStartCb: renderMapZoomStart,
  zoomEndCb: renderMapZoomEnd,
  layoutCb: renderMapLayout,
})

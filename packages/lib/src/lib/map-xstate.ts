import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { emptyLayout } from '../lib/layout'
import { type Layout, type LayoutConfig } from '../lib/layout-types'
import { registerCbs } from './config-xstate'
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
          zoom: 1,
          z: null,
        }),
      ],
    },
  },
})

//type RenderMapRef = ActorRefFrom<typeof renderMapMachine>
//type RenderMapState = StateFrom<typeof renderMapMachine>

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
renderMapActor.start()

const renderMapZoomStart = (
  layout: Readonly<Layout>,
  zoom: number,
  z: number
) => renderMapActor.send({ type: 'ZOOM', layout, zoom, z })
const renderMapZoomEnd = (layout: Readonly<Layout>, zoom: number) =>
  renderMapActor.send({ type: 'ZOOM', layout, zoom, z: null })
const renderMapLayout = (layout: Layout) =>
  renderMapActor.send({ type: 'LAYOUT', layout })

registerCbs({
  zoomStartCb: renderMapZoomStart,
  zoomEndCb: renderMapZoomEnd,
  layoutCb: renderMapLayout,
})

export function renderMapActorStart(): void {
  renderMapActor.start()
}

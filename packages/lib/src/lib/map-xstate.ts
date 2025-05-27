import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { emptyLayout, type Layout, type LayoutConfig } from '../lib/layout'
import { registerCbs } from './config'

type RenderMapContext = {
  layout: Readonly<Layout>
  zoom: number
  z: null | number
}
type RenderMapEvent =
  | ({ type: 'ZOOM' } & RenderMapContext)
  | { type: 'LAYOUT'; layout: Layout }

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

export const renderMapZoomStart = (
  layout: Readonly<Layout>,
  zoom: number,
  z: number
): void => renderMapActor.send({ type: 'ZOOM', layout, zoom, z })
export const renderMapZoomEnd = (
  layout: Readonly<Layout>,
  zoom: number
): void => renderMapActor.send({ type: 'ZOOM', layout, zoom, z: null })
export const renderMapLayout = (layout: Layout): void =>
  renderMapActor.send({ type: 'LAYOUT', layout })

registerCbs({
  zoomStartCb: renderMapZoomStart,
  zoomEndCb: renderMapZoomEnd,
  layoutCb: renderMapLayout,
})

export function renderMapActorStart(): void {
  renderMapActor.start()
}

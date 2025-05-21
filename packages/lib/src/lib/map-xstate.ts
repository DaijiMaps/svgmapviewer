import { ActorRefFrom, assign, createActor, setup, StateFrom } from 'xstate'
import '../index.css'
import { emptyLayout, Layout } from '../lib/layout'
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

export type RenderMapRef = ActorRefFrom<typeof renderMapMachine>
export type RenderMapState = StateFrom<typeof renderMapMachine>

export const selectLayoutConfig = (state: Readonly<RenderMapState>) =>
  state.context.layout.config
export const selectLayoutSvgScaleS = (state: Readonly<RenderMapState>) =>
  state.context.layout.svgScale.s
export const selectZoom = (state: Readonly<RenderMapState>) =>
  state.context.zoom

////

export const renderMapActor = createActor(renderMapMachine, {
  input: {
    layout: emptyLayout,
  },
})
renderMapActor.start()

export const renderMapZoomStart = (
  layout: Readonly<Layout>,
  zoom: number,
  z: number
) => renderMapActor.send({ type: 'ZOOM', layout, zoom, z })
export const renderMapZoomEnd = (layout: Readonly<Layout>, zoom: number) =>
  renderMapActor.send({ type: 'ZOOM', layout, zoom, z: null })
export const renderMapLayout = (layout: Layout) =>
  renderMapActor.send({ type: 'LAYOUT', layout })

registerCbs({
  zoomStartCb: renderMapZoomStart,
  zoomEndCb: renderMapZoomEnd,
  layoutCb: renderMapLayout,
})

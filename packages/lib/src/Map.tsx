/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useActorRef } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { ActorRefFrom, assign, setup, StateFrom } from 'xstate'
import './index.css'
import { configActor, SvgMapViewerConfig } from './lib'
import { emptyLayout, Layout } from './lib/layout'

export function RenderMap(props: Readonly<{ config: SvgMapViewerConfig }>) {
  const { renderMapRef } = useRenderMap()

  return props.config.renderMap({ renderMapRef })
}

function useRenderMap(): { renderMapRef: RenderMapRef } {
  const renderMapRef = useActorRef(renderMapMachine, {
    input: {
      layout: emptyLayout,
    },
  })

  const zoomStart = useCallback(
    (layout: Layout, zoom: number, z: number) =>
      renderMapRef.send({ type: 'ZOOM', layout, zoom, z }),
    [renderMapRef]
  )

  const zoomEnd = useCallback(
    (layout: Layout, zoom: number) =>
      renderMapRef.send({ type: 'ZOOM', layout, zoom, z: null }),
    [renderMapRef]
  )

  useEffect(() => {
    configActor.start()
    configActor.send({
      type: 'ADD.CB',
      zoomStartCb: zoomStart,
      zoomEndCb: zoomEnd,
    })
    return () => {
      configActor.send({
        type: 'DELETE.CB',
        zoomStartCb: zoomStart,
        zoomEndCb: zoomEnd,
      })
    }
  }, [zoomEnd, zoomStart])

  return { renderMapRef }
}

type RenderMapContext = { layout: Layout; zoom: number; z: null | number }
type RenderMapEvent = { type: 'ZOOM' } & RenderMapContext

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

/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useMachine } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { assign, setup } from 'xstate'
import './index.css'
import { SvgMapViewerConfig } from './lib'
import { svgMapViewerConfig } from './lib/config'
import { Layout } from './lib/layout'

export function RenderMap(props: Readonly<{ config: SvgMapViewerConfig }>) {
  const { state } = useRenderMap()

  return props.config.renderMap(state.context)
}

function useRenderMap() {
  const [state, send] = useMachine(renderMapMachine, {
    input: {
      layout: svgMapViewerConfig.layout,
    },
  })

  const zoomStart = useCallback(
    (layout: Layout, zoom: number, z: number) =>
      send({ type: 'ZOOM', layout, zoom, z }),
    [send]
  )

  const zoomEnd = useCallback(
    (layout: Layout, zoom: number) =>
      send({ type: 'ZOOM', layout, zoom, z: null }),
    [send]
  )

  useEffect(() => {
    svgMapViewerConfig.zoomStartCbs.add(zoomStart)
    svgMapViewerConfig.zoomEndCbs.add(zoomEnd)
    return () => {
      svgMapViewerConfig.zoomStartCbs.delete(zoomStart)
      svgMapViewerConfig.zoomEndCbs.delete(zoomEnd)
    }
  }, [zoomEnd, zoomStart])

  return { state }
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

/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useMachine } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { assign, setup } from 'xstate'
import './index.css'
import { SvgMapViewerConfig } from './lib'
import { svgMapViewerConfig } from './lib/config'

export function RenderMap(props: Readonly<{ config: SvgMapViewerConfig }>) {
  const { state } = useRenderMap()

  return props.config.renderMap(state.context)
}

function useRenderMap() {
  const [state, send] = useMachine(renderMapMachine)

  const zoomStart = useCallback(
    (zoom: number, z: number) => send({ type: 'ZOOM', zoom, z }),
    [send]
  )

  const zoomEnd = useCallback(
    (zoom: number) => send({ type: 'ZOOM', zoom, z: null }),
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

type RenderMapContext = { zoom: number; z: null | number }
type RenderMapEvent = { type: 'ZOOM' } & RenderMapContext

const renderMapMachine = setup({
  types: {
    context: {} as RenderMapContext,
    events: {} as RenderMapEvent,
  },
}).createMachine({
  id: 'render-map',
  context: { zoom: 0, z: null },
  on: {
    ZOOM: {
      actions: [
        assign({
          zoom: ({ event: { zoom } }) => zoom,
          z: ({ event: { z } }) => z,
        }),
      ],
    },
  },
})

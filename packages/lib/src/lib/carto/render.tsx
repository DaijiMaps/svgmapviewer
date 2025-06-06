/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import { RenderMapLayers } from './layers'
import { RenderMapMarkers } from './markers'
import { RenderMapObjects } from './objects'

export function RenderMapCommon(): ReactNode {
  return (
    <>
      <g id={cfg.map} className="map">
        <RenderMapLayers mapLayers={cfg.getMapLayers()} />
        <RenderMapObjects mapObjects={cfg.getMapObjects()} />
        <RenderMapMarkers />
      </g>
    </>
  )
}

/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import { RenderMapLayers } from './layers'
import { RenderMapObjects } from './objects'

export function RenderMapCommon(): ReactNode {
  const style = cfg.mapSvgStyle

  return (
    <>
      <g id={cfg.map} className="map">
        <RenderMapLayers mapLayers={cfg.getMapLayers()} />
        <RenderMapObjects mapObjects={cfg.getMapObjects()} />
        <style>{style}</style>
      </g>
    </>
  )
}

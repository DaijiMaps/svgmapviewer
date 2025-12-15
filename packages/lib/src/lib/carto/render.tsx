import { type ReactNode } from 'react'
import { RenderMapLayers } from './layers'
import { RenderMapObjects } from './objects'
import type { RenderMapProps } from '../../types'

export function RenderMapCommon(props: Readonly<RenderMapProps>): ReactNode {
  const style = props.render.mapSvgStyle

  return (
    <>
      <g id={props.render.map} className="map">
        <RenderMapLayers
          m={props.data.mapCoord.matrix}
          mapLayers={props.render.getMapLayers()}
        />
        <RenderMapObjects
          m={props.data.mapCoord.matrix}
          mapObjects={props.render.getMapObjects()}
        />
        <style>{style}</style>
      </g>
    </>
  )
}

import { type ReactNode } from 'react'
import { RenderMapLayers } from './layers'
import { RenderMapObjects } from './objects'
import { type OsmRenderMapProps } from '../../types'

export function RenderMapCommon(props: Readonly<OsmRenderMapProps>): ReactNode {
  const style = props.render.mapSvgStyle

  return (
    <>
      <g id="map1" className="map">
        <RenderMapLayers
          {...props}
          m={props.data.mapCoord.matrix}
          mapLayers={props.render.getMapLayers()}
        />
        <RenderMapObjects
          {...props}
          m={props.data.mapCoord.matrix}
          mapObjects={props.render.getMapObjects()}
        />
        <style>{style}</style>
      </g>
    </>
  )
}

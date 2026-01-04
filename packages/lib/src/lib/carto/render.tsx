import { type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../types'
import { RenderMapObjects } from './objects'
import { RenderMapPaths } from './paths'

export function RenderMapCommon(props: Readonly<OsmRenderMapProps>): ReactNode {
  const style = props.render.mapSvgStyle

  return (
    <>
      <g id="map1" className="map">
        <RenderMapPaths
          {...props}
          m={props.data.mapCoord.matrix}
          mapPaths={props.render.getMapPaths()}
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

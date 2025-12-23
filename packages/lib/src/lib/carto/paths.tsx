import { Fragment, type ReactNode } from 'react'
import { type OsmDataConfig, type OsmRenderMapProps } from '../../types'
import { lineOps } from './paths-line'
import { multiPolygonOps } from './paths-multipolygon'
import { type MapPathOps, type OsmMapPathOps } from './types'

export function RenderMapPaths(
  props: Readonly<
    OsmRenderMapProps & {
      m: DOMMatrixReadOnly
      mapPaths: readonly OsmMapPathOps[]
    }
  >
): ReactNode {
  return (
    <g className="map-paths">
      {props.mapPaths.map((layer, i) => (
        <Fragment key={i}>
          {layer instanceof Array ? (
            <g>
              {layer.map((l, j) => (
                <Fragment key={j}>
                  {layerToPaths(l, props.data, props.m)}
                </Fragment>
              ))}
            </g>
          ) : (
            <>{layerToPaths(layer, props.data, props.m)}</>
          )}
        </Fragment>
      ))}
    </g>
  )
}

function layerToPaths(
  layer: MapPathOps,
  data: Readonly<OsmDataConfig>,
  m: DOMMatrixReadOnly
): ReactNode {
  return layer.type === 'line'
    ? lineOps.renderPaths(layer, m, data.mapData.lines.features)
    : multiPolygonOps.renderPaths(layer, m, data.mapData.multipolygons.features)
}

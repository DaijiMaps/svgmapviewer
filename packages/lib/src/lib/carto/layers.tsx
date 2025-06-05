import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import {
  type Line,
  type LinesFilter,
  lineToPathD,
  type MultiPolygon,
  type MultiPolygonsFilter,
  multiPolygonToPathD,
} from '../geo'
import type { MapLayer, MapLineLayer, MapMultiPolygonLayer } from './types'

export function RenderMapLayers(
  props: Readonly<{ mapLayers: MapLayer[] }>
): ReactNode {
  return (
    <g className="map-layers">
      {props.mapLayers.map((layer, i) => (
        <Fragment key={i}>
          {layer.type === 'line'
            ? lineLayerToPaths(layer)
            : multiPolygonLayerToPath(layer)}
        </Fragment>
      ))}
    </g>
  )
}

function lineLayerToPaths(layer: Readonly<MapLineLayer>): ReactNode {
  const xs =
    layer.filter !== undefined
      ? getLines(layer.filter)
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <path
          key={idx}
          className={layer.name}
          width={layerToWidth(layer)}
          d={lineToPathD(x)}
        />
      ))}
    </g>
  )
}

function multiPolygonLayerToPath(
  layer: Readonly<MapMultiPolygonLayer>
): ReactNode {
  const xs: MultiPolygon[] =
    layer.filter !== undefined
      ? getMultiPolygons(layer.filter)
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <path
          key={idx}
          className={layer.name}
          width={layerToWidth(layer)}
          d={multiPolygonToPathD(x)}
        />
      ))}
    </g>
  )
}

function layerToWidth(layer: Readonly<MapLayer>): undefined | number {
  return layer.type === 'line' && typeof layer.width === 'number'
    ? layer.width
    : undefined
}

function getLines(filter: LinesFilter): Line[] {
  return cfg.mapData.lines.features
    .filter((f) => filter(f.properties))
    .map((f) => f.geometry.coordinates) as unknown as Line[]
}

function getMultiPolygons(filter: MultiPolygonsFilter): MultiPolygon[] {
  return cfg.mapData.multipolygons.features
    .filter((f) => filter(f.properties))
    .map((f) => f.geometry.coordinates) as unknown as MultiPolygon[]
}

import { type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import {
  type Line,
  type LinesFilter,
  lineToPath,
  type MultiPolygon,
  type MultiPolygonsFilter,
  multiPolygonToPath,
} from '../geo'
import type { MapLayer, MapLineLayer, MapMultiPolygonLayer } from './types'

export function RenderMapLayers(
  props: Readonly<{ mapLayers: MapLayer[] }>
): ReactNode {
  return (
    <g className="map-layers">
      {props.mapLayers.map((layer, i) => (
        <g key={i}>
          <path
            className={layer.name}
            width={layerToWidth(layer)}
            d={layerToPath(layer)}
          />
        </g>
      ))}
    </g>
  )
}

function layerToWidth(layer: Readonly<MapLayer>): undefined | number {
  return layer.type === 'line' && typeof layer.width === 'number'
    ? layer.width
    : undefined
}

function layerToPath(layer: Readonly<MapLayer>): string {
  return layer.type === 'line'
    ? lineLayerToPath(layer)
    : multiPolygonLayerToPath(layer)
}

function lineLayerToPath(layer: Readonly<MapLineLayer>): string {
  const xs =
    layer.filter !== undefined
      ? getLines(layer.filter)
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.map(lineToPath).join('')
}

function multiPolygonLayerToPath(
  layer: Readonly<MapMultiPolygonLayer>
): string {
  const xs: MultiPolygon[] =
    layer.filter !== undefined
      ? getMultiPolygons(layer.filter)
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.map(multiPolygonToPath).join('')
}

function getLines(filter: LinesFilter): Line[] {
  return cfg.mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as Line[]
}

function getMultiPolygons(filter: MultiPolygonsFilter): MultiPolygon[] {
  return cfg.mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as MultiPolygon[]
}

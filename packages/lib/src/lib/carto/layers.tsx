import { type ReactNode } from 'react'
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
        <g key={i}>
          {layer.type === 'line'
            ? lineLayerToPaths(layer)
            : multiPolygonLayerToPath(layer)}{' '}
        </g>
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
  return (
    <>
      {xs.map((x, idx) => (
        <path
          key={idx}
          className={layer.name}
          width={layerToWidth(layer)}
          d={lineToPathD(x)}
        />
      ))}
    </>
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
  return (
    <>
      {xs.map((x, idx) => (
        <path
          key={idx}
          className={layer.name}
          width={layerToWidth(layer)}
          d={multiPolygonToPathD(x)}
        />
      ))}
    </>
  )
}

function layerToWidth(layer: Readonly<MapLayer>): undefined | number {
  return layer.type === 'line' && typeof layer.width === 'number'
    ? layer.width
    : undefined
}

/*
function layerToPathD(layer: Readonly<MapLayer>): string {
  return layer.type === 'line'
    ? lineLayerToPathD(layer)
    : multiPolygonLayerToPathD(layer)
}

function lineLayerToPathD(layer: Readonly<MapLineLayer>): string {
  const xs =
    layer.filter !== undefined
      ? getLines(layer.filter)
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.map(lineToPathD).join('')
}

function multiPolygonLayerToPathD(
  layer: Readonly<MapMultiPolygonLayer>
): string {
  const xs: MultiPolygon[] =
    layer.filter !== undefined
      ? getMultiPolygons(layer.filter)
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.map(multiPolygonToPathD).join('')
}
*/

////

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

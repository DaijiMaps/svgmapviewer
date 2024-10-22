import { svgMapViewerConfig } from '../config'
import {
  Line,
  LinesFilter,
  lineToPath,
  MultiPolygon,
  MultiPolygonsFilter,
  multiPolygonToPath,
} from '../geo'

export function RenderMapLayers(props: Readonly<{ mapLayers: MapLayer[] }>) {
  return (
    <g>
      {props.mapLayers.map((layer, i) => (
        <g key={i}>
          <path className={layer.name} d={layerToPath(layer)} />
        </g>
      ))}
    </g>
  )
}

export type MapLayer = MapLineLayer | MapMultiPolygonLayer

export interface MapLineLayer {
  type: 'line'
  name: string
  filter?: LinesFilter
  data?: Line[]
}

export interface MapMultiPolygonLayer {
  type: 'multipolygon'
  name: string
  filter?: MultiPolygonsFilter
  data?: MultiPolygon[]
}

function layerToPath(layer: Readonly<MapLayer>): string {
  return layer.type === 'line'
    ? lineLayerToPath(layer)
    : multiPolygonLayerToPath(layer)
}

function lineLayerToPath(layer: Readonly<MapLineLayer>): string {
  const xs =
    layer.filter !== undefined
      ? (svgMapViewerConfig.mapData.lines.features
          .filter(layer.filter)
          .map((f) => f.geometry.coordinates) as unknown as Line[])
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
      ? (svgMapViewerConfig.mapData.multipolygons.features
          .filter(layer.filter)
          .map((f) => f.geometry.coordinates) as unknown as MultiPolygon[])
      : layer.data !== undefined
        ? layer.data
        : []
  return xs.map(multiPolygonToPath).join('')
}

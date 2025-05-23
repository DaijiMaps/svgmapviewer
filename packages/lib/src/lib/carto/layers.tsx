import { svgMapViewerConfig as cfg } from '../config'
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

export type MapLayer = MapLineLayer | MapMultiPolygonLayer

export interface MapLineLayer {
  type: 'line'
  name: string
  width?: number
  filter?: LinesFilter
  data?: Line[]
}

export interface MapMultiPolygonLayer {
  type: 'multipolygon'
  name: string
  filter?: MultiPolygonsFilter
  data?: MultiPolygon[]
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

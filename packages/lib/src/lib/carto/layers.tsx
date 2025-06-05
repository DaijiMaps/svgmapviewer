import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import {
  type Line,
  type LinesFilter,
  lineToPathD,
  type MultiPolygon,
  type MultiPolygonsFilter,
  multiPolygonToPathD,
  type OsmProperties,
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
  const xs: LinePath[] =
    layer.filter !== undefined
      ? getLines(layer.filter)
      : layer.data !== undefined
        ? layer.data.map((vs) => ({ classNames: [], vs }))
        : []
  const strokeWidth = layerToWidth(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map(({ classNames, width, vs }, idx) => (
        <path
          key={idx}
          className={[layer.name, ...classNames]
            .join(' ')
            .replaceAll(/;/g, '_')} // XXX level=0;1
          strokeWidth={width == undefined ? strokeWidth : width}
          d={lineToPathD(vs)}
        />
      ))}
    </g>
  )
}

function multiPolygonLayerToPath(
  layer: Readonly<MapMultiPolygonLayer>
): ReactNode {
  const xs: MultiPolygonPath[] =
    layer.filter !== undefined
      ? getMultiPolygons(layer.filter)
      : layer.data !== undefined
        ? layer.data.map((vs) => ({ classNames: [], vs }))
        : []
  const strokeWidth = layerToWidth(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map(({ classNames, width, vs }, idx) => (
        <path
          key={idx}
          className={[layer.name, ...classNames]
            .join(' ')
            .replaceAll(/;/g, '_')} // XXX level=0;1
          strokeWidth={width === undefined ? strokeWidth : width}
          d={multiPolygonToPathD(vs)}
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

interface LinePath {
  classNames: string[]
  width?: number
  vs: Line
}
interface MultiPolygonPath {
  classNames: string[]
  width?: number
  vs: MultiPolygon
}

function getLines(filter: LinesFilter): LinePath[] {
  return cfg.mapData.lines.features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      classNames: propertiesToClassNames(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates as unknown as Line,
    }))
}

function getMultiPolygons(filter: MultiPolygonsFilter): MultiPolygonPath[] {
  return cfg.mapData.multipolygons.features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      classNames: propertiesToClassNames(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates as unknown as MultiPolygon,
    }))
}

function propertiesToWidth(p: OsmProperties): undefined | number {
  // XXX
  // XXX
  // XXX
  const re = /"width"=>"([1-9][.0-9]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? undefined : Math.round(Number(m[1]))
  // XXX
  // XXX
  // XXX
}

function propertiesToClassNames(p: OsmProperties): string[] {
  return ops.flatMap((f) => f(p))
}

const ops = [
  toAccess,
  toService,
  toSurface,
  toLanes,
  toTunnel,
  toBuilding,
  toLevel,
]

function toAccess(p: OsmProperties): string[] {
  const re = /"access"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`access-${m[1]}`]
}

function toService(p: OsmProperties): string[] {
  const re = /"service"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`service-${m[1]}`]
}

function toSurface(p: OsmProperties): string[] {
  const re = /"surface"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`surface-${m[1]}`]
}

function toLanes(p: OsmProperties): string[] {
  const re = /"lanes"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`lanes-${m[1]}`]
}

function toTunnel(p: OsmProperties): string[] {
  const re = /"tunnel"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`tunnel-${m[1]}`]
}

function toBuilding(p: OsmProperties): string[] {
  const re = /"building"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`building-${m[1]}`]
}

function toLevel(p: OsmProperties): string[] {
  const re = /"level"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`level-${m[1]}`]
}

import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import {
  getOsmId,
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
        ? layer.data.map((vs) => ({ tags: [], vs }))
        : []
  const defaultStrokeWidth = layerToWidth(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name} style={{ contain: 'content' }}>
      {xs.map(({ name, id, tags, width, vs }, idx) => {
        const strokeWidth = width == undefined ? defaultStrokeWidth : width
        return (
          <Fragment key={idx}>
            <path
              id={id === undefined ? undefined : `path${id}`}
              className={[layer.name, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
              strokeWidth={strokeWidth}
              d={lineToPathD(vs)}
            />
            {name !== undefined &&
              id !== undefined &&
              strokeWidth !== undefined && (
                <text>
                  <textPath
                    href={`#path${id}`}
                    startOffset="50%"
                    fontSize={strokeWidth}
                    fill="green"
                    stroke="none"
                  >
                    {name}
                  </textPath>
                </text>
              )}
          </Fragment>
        )
      })}
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
        ? layer.data.map((vs) => ({ tags: [], vs }))
        : []
  const strokeWidth = layerToWidth(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map(({ id, tags, width, vs }, idx) => (
        <path
          key={idx}
          id={id}
          className={[layer.name, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
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
  name?: string
  id?: string
  tags: string[]
  width?: number
  vs: Line
}
interface MultiPolygonPath {
  name?: string
  id?: string
  tags: string[]
  width?: number
  vs: MultiPolygon
}

function getLines(filter: LinesFilter): LinePath[] {
  return cfg.mapData.lines.features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      name: undefinedIfNull(f.properties.name),
      id: getOsmId(f.properties) + '',
      tags: propertiesToTags(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates as unknown as Line,
    }))
}

function getMultiPolygons(filter: MultiPolygonsFilter): MultiPolygonPath[] {
  return cfg.mapData.multipolygons.features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      name: undefinedIfNull(f.properties.name),
      id: getOsmId(f.properties) + '',
      tags: propertiesToTags(f.properties),
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

function propertiesToTags(p: OsmProperties): string[] {
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

function undefinedIfNull<T>(a: undefined | null | T): undefined | T {
  return a === undefinedIfNull || a === null ? undefined : a
}

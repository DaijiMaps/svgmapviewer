import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../../config'
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
import { lineToPathD2, multiPolygonToPathD2 } from '../geo/path'
import type {
  LinePath,
  MapLayer,
  MapLineLayer,
  MapMultiPolygonLayer,
  MultiPolygonPath,
} from './types'

export function RenderMapLayers(
  props: Readonly<{
    m: DOMMatrixReadOnly
    mapLayers: MapLayer[]
  }>
): ReactNode {
  return (
    <g className="map-layers">
      {props.mapLayers.map((layer, i) => (
        <Fragment key={i}>
          {layer.type === 'line'
            ? LineLayerToPaths2(props.m, layer)
            : MultiPolygonLayerToPath2(props.m, layer)}
        </Fragment>
      ))}
    </g>
  )
}

export function RenderMapLayers2(
  props: Readonly<{
    m: DOMMatrixReadOnly
    mapLayers: MapLayer[]
  }>
): ReactNode {
  return (
    <g className="map-layers">
      {props.mapLayers.map((layer, i) => (
        <Fragment key={i}>
          {layer.type === 'line'
            ? LineLayerToPaths2(props.m, layer)
            : MultiPolygonLayerToPath2(props.m, layer)}
        </Fragment>
      ))}
    </g>
  )
}

function lineLayerToLinePaths(layer: Readonly<MapLineLayer>) {
  return layer.filter !== undefined
    ? getLines(layer.filter)
    : layer.data !== undefined
      ? layer.data.map((vs) => ({ tags: [], vs }))
      : []
}

function multiPolygonLayerToMultiPolygonPaths(
  layer: Readonly<MapMultiPolygonLayer>
) {
  return layer.filter !== undefined
    ? getMultiPolygons(layer.filter)
    : layer.data !== undefined
      ? layer.data.map((vs) => ({ tags: [], vs }))
      : []
}

// XXX
export function LineLayerToPaths(layer: Readonly<MapLineLayer>): ReactNode {
  const xs: LinePath[] = lineLayerToLinePaths(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name} style={{ contain: 'content' }}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {LinePathToPath(x, layer.name, layer.width, layer.widthScale)}
        </Fragment>
      ))}
    </g>
  )
}

function LineLayerToPaths2(
  m: DOMMatrixReadOnly,
  layer: Readonly<MapLineLayer>
): ReactNode {
  const xs: LinePath[] = lineLayerToLinePaths(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name} style={{ contain: 'content' }}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {LinePathToPath2(m, x, layer.name, layer.width, layer.widthScale)}
        </Fragment>
      ))}
    </g>
  )
}

function LinePathToPath(
  { id, tags, width, widthScale, vs }: Readonly<LinePath>,
  layerName: string,
  defaultStrokeWidth?: number,
  defaultStrokeWidthScale?: number
): ReactNode {
  return (
    <path
      id={id === undefined ? undefined : `path${id}`}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={lineToPathD(vs)}
    />
  )
}

function LinePathToPath2(
  m: DOMMatrixReadOnly,
  { id, tags, width, widthScale, vs }: Readonly<LinePath>,
  layerName: string,
  defaultStrokeWidth?: number,
  defaultStrokeWidthScale?: number
): ReactNode {
  return (
    <path
      id={id === undefined ? undefined : `path${id}`}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={lineToPathD2(m)(vs)}
    />
  )
}

// XXX
// XXX slow
// XXX
export function LinePathToTextPath(
  { name, id, tags, width }: Readonly<LinePath>,
  layerName: string,
  defaultStrokeWidth?: number
): ReactNode {
  return name === undefined ||
    id === undefined ||
    (width ?? defaultStrokeWidth) === undefined ? (
    <></>
  ) : (
    <text
      key={`textpath${id}`}
      id={id === undefined ? undefined : `textpath${id}`}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
    >
      <textPath
        href={`#path${id}`}
        startOffset="50%"
        fontSize={width ?? defaultStrokeWidth ?? 1}
        fill="green"
        stroke="none"
      >
        {name}
      </textPath>
    </text>
  )
}

// XXX
export function MultiPolygonLayerToPath(
  layer: Readonly<MapMultiPolygonLayer>
): ReactNode {
  const xs: MultiPolygonPath[] = multiPolygonLayerToMultiPolygonPaths(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {MultiPolygonPathToPath(x, layer.name, layer.width, layer.widthScale)}
        </Fragment>
      ))}
    </g>
  )
}

function MultiPolygonLayerToPath2(
  m: DOMMatrixReadOnly,
  layer: Readonly<MapMultiPolygonLayer>
): ReactNode {
  const xs: MultiPolygonPath[] = multiPolygonLayerToMultiPolygonPaths(layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {MultiPolygonPathToPath2(
            m,
            x,
            layer.name,
            layer.width,
            layer.widthScale
          )}
        </Fragment>
      ))}
    </g>
  )
}

function MultiPolygonPathToPath(
  { id, tags, width, widthScale, vs }: Readonly<MultiPolygonPath>,
  layerName: string,
  defaultStrokeWidth?: number,
  defaultStrokeWidthScale?: number
): ReactNode {
  return (
    <path
      id={id}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={multiPolygonToPathD(vs)}
    />
  )
}

function MultiPolygonPathToPath2(
  m: DOMMatrixReadOnly,
  { id, tags, width, widthScale, vs }: Readonly<MultiPolygonPath>,
  layerName: string,
  defaultStrokeWidth?: number,
  defaultStrokeWidthScale?: number
): ReactNode {
  return (
    <path
      id={id}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={multiPolygonToPathD2(m)(vs)}
    />
  )
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

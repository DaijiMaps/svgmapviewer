import { Fragment, type ReactNode } from 'react'
import { type OsmDataConfig, type OsmRenderMapProps } from '../../types'
import {
  getOsmId,
  type LinesFilter,
  type MultiPolygonsFilter,
  type OsmMapData,
  type OsmProperties,
} from '../geo'
import { lineToPathD, multiPolygonToPathD } from '../geo/path'
import {
  type LinePath,
  type MapLinePaths,
  type MapMultiPolygonPaths,
  type MultiPolygonPath,
  type OsmMapPaths,
} from './types'

export function RenderMapPaths(
  props: Readonly<
    OsmRenderMapProps & {
      m: DOMMatrixReadOnly
      mapPaths: readonly OsmMapPaths[]
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
  layer: MapLinePaths | MapMultiPolygonPaths,
  data: Readonly<OsmDataConfig>,
  m: DOMMatrixReadOnly
): ReactNode {
  return layer.type === 'line'
    ? LineLayerToPaths(data.mapData, m, layer)
    : MultiPolygonPathsToPath(data.mapData, m, layer)
}

function lineLayerToLinePaths(
  mapData: Readonly<OsmMapData>,
  layer: Readonly<MapLinePaths>
) {
  return layer.filter !== undefined
    ? getLines(mapData, layer.filter)
    : layer.data !== undefined
      ? layer.data().map((vs) => ({ tags: [], vs }))
      : []
}

function multiPolygonLayerToMultiPolygonPaths(
  mapData: Readonly<OsmMapData>,
  layer: Readonly<MapMultiPolygonPaths>
) {
  return layer.filter !== undefined
    ? getMultiPolygons(mapData, layer.filter)
    : layer.data !== undefined
      ? layer.data().map((vs) => ({ tags: [], vs }))
      : []
}

function LineLayerToPaths(
  mapData: Readonly<OsmMapData>,
  m: DOMMatrixReadOnly,
  layer: Readonly<MapLinePaths>
): ReactNode {
  const xs: readonly LinePath[] = lineLayerToLinePaths(mapData, layer)
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name} style={{ contain: 'content' }}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {LinePathToPath(m, x, layer.name, layer.width, layer.widthScale)}
        </Fragment>
      ))}
    </g>
  )
}

function LinePathToPath(
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
      d={lineToPathD(m)(vs)}
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

function MultiPolygonPathsToPath(
  mapData: Readonly<OsmMapData>,
  m: DOMMatrixReadOnly,
  layer: Readonly<MapMultiPolygonPaths>
): ReactNode {
  const xs: readonly MultiPolygonPath[] = multiPolygonLayerToMultiPolygonPaths(
    mapData,
    layer
  )
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {MultiPolygonPathToPath(
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
      d={multiPolygonToPathD(m)(vs)}
    />
  )
}

function getLines(
  mapData: Readonly<OsmMapData>,
  filter: LinesFilter
): readonly LinePath[] {
  return mapData.lines.features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      name: undefinedIfNull(f.properties.name),
      id: getOsmId(f.properties) + '',
      tags: propertiesToTags(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates,
    }))
}

function getMultiPolygons(
  mapData: Readonly<OsmMapData>,
  filter: MultiPolygonsFilter
): readonly MultiPolygonPath[] {
  return mapData.multipolygons.features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      name: undefinedIfNull(f.properties.name),
      id: getOsmId(f.properties) + '',
      tags: propertiesToTags(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates,
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

function propertiesToTags(p: Readonly<OsmProperties>): readonly string[] {
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

function toAccess(p: OsmProperties): readonly string[] {
  const re = /"access"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`access-${m[1]}`]
}

function toService(p: OsmProperties): readonly string[] {
  const re = /"service"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`service-${m[1]}`]
}

function toSurface(p: OsmProperties): readonly string[] {
  const re = /"surface"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`surface-${m[1]}`]
}

function toLanes(p: OsmProperties): readonly string[] {
  const re = /"lanes"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`lanes-${m[1]}`]
}

function toTunnel(p: OsmProperties): readonly string[] {
  const re = /"tunnel"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`tunnel-${m[1]}`]
}

function toBuilding(p: OsmProperties): readonly string[] {
  const re = /"building"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`building-${m[1]}`]
}

function toLevel(p: OsmProperties): readonly string[] {
  const re = /"level"=>"([^"][^"]*)"/
  const m = p?.other_tags?.match(re)
  return !m ? [] : [`level-${m[1]}`]
}

function undefinedIfNull<T>(a: undefined | null | T): undefined | T {
  return a === undefinedIfNull || a === null ? undefined : a
}

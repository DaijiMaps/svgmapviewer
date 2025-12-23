import { Fragment, type ReactNode } from 'react'
import { undefinedIfNull } from '../../utils'
import { getOsmId, lineToPathD } from '../geo'
import type { OsmLineFeatures } from '../geo/osm-types'
import { propertiesToTags, propertiesToWidth } from './properties'
import type { LinePath, LinePaths, MapLinePathOps, PathOps } from './types'

////

type LineOps = PathOps<MapLinePathOps>

export const lineOps: LineOps = {
  renderPaths,
  layerToPaths,
  renderPath,
  toPathD: lineToPathD,
}

export function renderPaths(
  layer: Readonly<MapLinePathOps>,
  m: DOMMatrixReadOnly,
  features: OsmLineFeatures
): ReactNode {
  const xs: LinePaths = lineOps.layerToPaths(layer, features)
  return (
    <g className={layer.name} style={{ contain: 'content' }}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>{renderPath(layer, m, x)}</Fragment>
      ))}
    </g>
  )
}

function layerToPaths(
  layer: Readonly<MapLinePathOps>,
  features: Readonly<OsmLineFeatures>
): LinePaths {
  return [...getPathsByFilter(layer, features), ...getPathsByData(layer)]
}

function getPathsByFilter(
  { filter }: Readonly<MapLinePathOps>,
  features: Readonly<OsmLineFeatures>
): LinePaths {
  return filter
    ? features
        .filter((f) => filter(f.properties))
        .map((f) => ({
          type: 'line',
          name: undefinedIfNull(f.properties.name),
          id: getOsmId(f.properties) + '',
          tags: propertiesToTags(f.properties),
          width: propertiesToWidth(f.properties),
          vs: f.geometry.coordinates,
        }))
    : []
}

function getPathsByData({ data }: Readonly<MapLinePathOps>): LinePaths {
  return data
    ? data().map((vs) => ({ type: 'line', tags: [], vs }) as LinePath)
    : []
}

////

function renderPath(
  {
    name: layerName,
    width: defaultStrokeWidth,
    widthScale: defaultStrokeWidthScale,
  }: Readonly<MapLinePathOps>,
  m: DOMMatrixReadOnly,
  { id, tags, width, widthScale, vs }: Readonly<LinePath>
): ReactNode {
  return (
    <path
      id={id === undefined ? undefined : `path${id}`}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={lineOps.toPathD(m)(vs)}
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

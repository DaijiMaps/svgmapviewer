import { Fragment, type ReactNode } from 'react'
import { undefinedIfNull } from '../../utils'
import { getOsmId, lineToPathD, type LinesFilter } from '../geo'
import type { OsmLineFeatures } from '../geo/osm-types'
import { propertiesToTags, propertiesToWidth } from './properties'
import type { LinePath, LinePaths, MapLinePathOps } from './types'

export function LineLayerToPaths(
  features: OsmLineFeatures,
  m: DOMMatrixReadOnly,
  layer: Readonly<MapLinePathOps>
): ReactNode {
  const xs: LinePaths = lineLayerToLinePaths(features, layer)
  return (
    <g className={layer.name} style={{ contain: 'content' }}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>{LinePathToPath(x, m, layer)}</Fragment>
      ))}
    </g>
  )
}

export function LinePathToPath(
  { id, tags, width, widthScale, vs }: Readonly<LinePath>,
  m: DOMMatrixReadOnly,
  {
    name: layerName,
    width: defaultStrokeWidth,
    widthScale: defaultStrokeWidthScale,
  }: Readonly<MapLinePathOps>
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

function lineLayerToLinePaths(
  features: Readonly<OsmLineFeatures>,
  layer: Readonly<MapLinePathOps>
): LinePaths {
  return layer.filter !== undefined
    ? getLines(features, layer.filter)
    : layer.data !== undefined
      ? layer.data().map((vs) => ({ type: 'line', tags: [], vs }) as LinePath)
      : []
}

export function getLines(
  features: Readonly<OsmLineFeatures>,
  filter: LinesFilter
): LinePaths {
  return features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      type: 'line',
      name: undefinedIfNull(f.properties.name),
      id: getOsmId(f.properties) + '',
      tags: propertiesToTags(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates,
    }))
}

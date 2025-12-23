import { Fragment, type ReactNode } from 'react'
import { undefinedIfNull } from '../../utils'
import {
  getOsmId,
  lineToPathD,
  type LinesFilter,
  type OsmMapData,
} from '../geo'
import { propertiesToTags, propertiesToWidth } from './properties'
import type { LinePath, MapLinePathOps } from './types'

export function LineLayerToPaths(
  mapData: Readonly<OsmMapData>,
  m: DOMMatrixReadOnly,
  layer: Readonly<MapLinePathOps>
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

export function LinePathToPath(
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

function lineLayerToLinePaths(
  mapData: Readonly<OsmMapData>,
  layer: Readonly<MapLinePathOps>
) {
  return layer.filter !== undefined
    ? getLines(mapData, layer.filter)
    : layer.data !== undefined
      ? layer.data().map((vs) => ({ tags: [], vs }))
      : []
}

export function getLines(
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

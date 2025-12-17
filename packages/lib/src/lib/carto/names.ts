import { type OsmRenderMapProps, type POI } from '../../types'
import { getOsmId, type OsmMapData, type OsmProperties } from '../geo'
import { vVec, type V } from '../tuple'

export const mapSymbols: POI[] = []

function pointNames(
  mapData: Readonly<OsmMapData>,
  skip?: Readonly<RegExp>,
  split?: Readonly<RegExp>
): POI[] {
  return mapData.points.features.flatMap(({ properties }) => {
    const id = getOsmId(properties)
    if (properties.centroid_x === null || properties.centroid_y === null) {
      return []
    }
    const centroid: V = [properties.centroid_x, properties.centroid_y]
    const pos = vVec(centroid)
    const name = filterName(properties, skip, split)
    return name.length === 0
      ? []
      : [
          {
            id: id === null ? null : id,
            name: name,
            pos,
            size: 0,
            area: undefined,
          },
        ]
  })
}

function lineNames(
  mapData: Readonly<OsmMapData>,
  skip?: Readonly<RegExp>,
  split?: Readonly<RegExp>
): POI[] {
  return mapData.lines.features.flatMap(({ properties }) => {
    const id = getOsmId(properties)
    if (properties.centroid_x === null || properties.centroid_y === null) {
      return []
    }
    const centroid: V = [properties.centroid_x, properties.centroid_y]
    const pos = vVec(centroid)
    const name = filterName(properties, skip, split)
    return name.length === 0
      ? []
      : [
          {
            id: id === null ? null : id,
            name: name,
            pos,
            size: 0,
            area: undefined,
          },
        ]
  })
}

function polygonNames(
  mapData: Readonly<OsmMapData>,
  skip?: Readonly<RegExp>,
  split?: Readonly<RegExp>
): POI[] {
  return mapData.multipolygons.features.flatMap(({ properties }) => {
    const id = getOsmId(properties)
    if (properties.centroid_x === null || properties.centroid_y === null) {
      return []
    }
    const centroid: V = [properties.centroid_x, properties.centroid_y]
    const pos = vVec(centroid)
    const area = undefinedIfNull(properties?.area)
    const name = filterName(properties, skip, split)
    return name.length === 0
      ? []
      : [
          {
            id: id === null ? null : id,
            name: name,
            pos,
            size: 0,
            area,
          },
        ]
  })
}

export function getMapNames(props: Readonly<OsmRenderMapProps>): POI[] {
  const skip = props.carto?.skipNamePattern
  const split = props.carto?.splitNamePattern
  return [
    ...pointNames(props.data.mapData, skip, split),
    //...lineNames(skip, split),
    ...polygonNames(props.data.mapData, skip, split),
  ]
}

export function getMapLineNames(props: Readonly<OsmRenderMapProps>): POI[] {
  const skip = props.carto?.skipNamePattern
  const split = props.carto?.splitNamePattern
  return lineNames(props.data.mapData, skip, split)
}

function filterName(
  properties: DeepReadonly<OsmProperties>,
  skip?: Readonly<RegExp>,
  split?: Readonly<RegExp>
): string[] {
  const name = properties.name
  if (name === null || typeof name !== 'string') {
    return []
  }
  if (skip !== undefined) {
    if (name.match(skip)) {
      return []
    }
  }
  return splitName(split === undefined ? name : name.replace(split, ' $1 '))
}

// eslint-disable-next-line no-irregular-whitespace
const WHITESPACE = /[ 　][ 　]*/

function splitName(s: string): string[] {
  return s
    .trim()
    .split(WHITESPACE)
    .map((s) => s.trim())
}

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends () //...args: readonly unknown[][]
  => unknown
    ? T[P]
    : T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P]
}

function undefinedIfNull<T>(a: undefined | null | T): undefined | T {
  return a === undefinedIfNull || a === null ? undefined : a
}

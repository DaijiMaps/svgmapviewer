/* eslint-disable functional/functional-parameters */

import { svgMapViewerConfig } from '../config'
import { getOsmId, type OsmProperties, type POI } from '../geo'
import { vUnvec, vVec, type V } from '../tuple'

export const mapSymbols: POI[] = []

function pointNames(skip?: Readonly<RegExp>, split?: Readonly<RegExp>): POI[] {
  return svgMapViewerConfig.mapData.points.features.flatMap(
    ({ properties }) => {
      const id = getOsmId(properties)
      if (properties.centroid_x === null || properties.centroid_y === null) {
        return []
      }
      const centroid: V = [properties.centroid_x, properties.centroid_y]
      const pos = vVec(conv(centroid))
      const name = filterName(properties, skip, split)
      return name === null
        ? []
        : [
            {
              id: id === null ? null : id,
              name: splitName(name),
              pos,
              size: 0,
              area: undefined,
            },
          ]
    }
  )
}

function lineNames(skip?: Readonly<RegExp>, split?: Readonly<RegExp>): POI[] {
  return svgMapViewerConfig.mapData.lines.features.flatMap(({ properties }) => {
    const id = getOsmId(properties)
    if (properties.centroid_x === null || properties.centroid_y === null) {
      return []
    }
    const centroid: V = [properties.centroid_x, properties.centroid_y]
    const pos = vVec(conv(centroid))
    const name = filterName(properties, skip, split)
    return name === null
      ? []
      : [
          {
            id: id === null ? null : id,
            name: splitName(name),
            pos,
            size: 0,
            area: undefined,
          },
        ]
  })
}

function polygonNames(
  skip?: Readonly<RegExp>,
  split?: Readonly<RegExp>
): POI[] {
  return svgMapViewerConfig.mapData.multipolygons.features.flatMap(
    ({ properties }) => {
      const id = getOsmId(properties)
      if (properties.centroid_x === null || properties.centroid_y === null) {
        return []
      }
      const centroid: V = [properties.centroid_x, properties.centroid_y]
      const pos = vVec(conv(centroid))
      const area = undefinedIfNull(properties?.area)
      const name = filterName(properties, skip, split)
      return name === null
        ? []
        : [
            {
              id: id === null ? null : id,
              name: splitName(name),
              pos,
              size: 0,
              area,
            },
          ]
    }
  )
}

export function getMapNames(): POI[] {
  const skip = svgMapViewerConfig.cartoConfig?.skipNamePattern
  const split = svgMapViewerConfig.cartoConfig?.splitNamePattern
  return [
    ...pointNames(skip, split),
    ...lineNames(skip, split),
    ...polygonNames(skip, split),
  ]
}

function filterName(
  properties: DeepReadonly<OsmProperties>,
  skip?: Readonly<RegExp>,
  split?: Readonly<RegExp>
): null | string {
  const name = properties.name
  if (name === null || typeof name !== 'string') {
    return null
  }
  if (skip !== undefined) {
    if (name.match(skip)) {
      return null
    }
  }
  return split === undefined ? name : name.replace(split, ' $1 ')
}

function splitName(s: string): string[] {
  return s
    .trim()
    .split(/  */)
    .map((s) => s.trim())
}

function conv(p: V): V {
  return vUnvec(svgMapViewerConfig.mapCoord.matrix.transformPoint(vVec(p)))
}

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (
    ...args: Readonly<unknown[]>
  ) => unknown
    ? T[P]
    : T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P]
}

function undefinedIfNull<T>(a: undefined | null | T): undefined | T {
  return a === undefinedIfNull || a === null ? undefined : a
}

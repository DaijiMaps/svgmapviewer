/* eslint-disable functional/functional-parameters */

import { svgMapViewerConfig } from '../../config'
import { getOsmId, type OsmProperties, type POI } from '../geo'
import { vVec, type V } from '../tuple'

export const mapSymbols: POI[] = []

function pointNames(skip?: Readonly<RegExp>, split?: Readonly<RegExp>): POI[] {
  return svgMapViewerConfig.mapData.points.features.flatMap(
    ({ properties }) => {
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
    }
  )
}

export function getMapNames(): POI[] {
  const skip = svgMapViewerConfig.cartoConfig?.skipNamePattern
  const split = svgMapViewerConfig.cartoConfig?.splitNamePattern
  return [
    ...pointNames(skip, split),
    //...lineNames(skip, split),
    ...polygonNames(skip, split),
  ]
}

export function getMapLineNames(): POI[] {
  const skip = svgMapViewerConfig.cartoConfig?.skipNamePattern
  const split = svgMapViewerConfig.cartoConfig?.splitNamePattern
  return lineNames(skip, split)
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

/* eslint-disable functional/functional-parameters */

import { svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { getOsmId, OsmFeature, POI } from '@daijimaps/svgmapviewer/geo'
import { V, vUnvec, vVec } from '@daijimaps/svgmapviewer/tuple'

export const mapSymbols: POI[] = []

const pointNames = (): POI[] =>
  svgMapViewerConfig.mapData.points.features.flatMap((f) => {
    const id = getOsmId(f.properties)
    const pos = vVec(conv(f.geometry.coordinates as unknown as V))

    const name = filterName(f)
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

const polygonNames = (): POI[] =>
  svgMapViewerConfig.mapData.multipolygons.features.flatMap((f) => {
    const id = getOsmId(f.properties)
    if (f.properties.centroid_x === null || f.properties.centroid_y === null) {
      return []
    }
    const centroid: V = [f.properties.centroid_x, f.properties.centroid_y]
    const pos = vVec(conv(centroid))
    const area = f.properties.area !== null ? f.properties.area : undefined

    const name = filterName(f)
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
  })

export const getMapNames = (): POI[] => [...pointNames(), ...polygonNames()]

function filterName(f: DeepReadonly<OsmFeature>): null | string {
  const name = f.properties.name
  if (name === null || typeof name !== 'string') {
    return null
  }
  if (f.properties.other_tags?.match(/"vending_machine"/)) {
    return null
  }
  if (
    name.match(/門$/) &&
    'osm_way_id' in f.properties &&
    f.properties.osm_way_id !== null
  ) {
    return null
  }
  if (
    name.match(
      /丁目$|町$|売店$|レストハウス|^新宿御苑$|センター|案内図$|Ticket|シラカシ/
    )
  ) {
    return null
  }
  // split name by keywords
  return name.replace(
    /(カフェ|レストラン|ミュージアム|センター|門衛所|御休所|休憩所|案内図|パビリオン|マーケットプレイス|ターミナル|停留所|エクスペリエンス|ポップアップステージ)/,
    ' $1 '
  )
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

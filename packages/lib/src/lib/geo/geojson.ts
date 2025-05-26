import { type BoxBox, boxScale } from '../box/prefixed'
import { type V, vSub } from '../tuple'
import {
  type VecVec,
  vecAdd,
  vecDiv,
  vecFromV,
  vecMul,
  vecSub,
  vecVec,
} from '../vec/prefixed'
import { type MapData } from './data'
import { type LineGeoJSON } from './geojson-types'

function getViewBox(viewbox: Readonly<LineGeoJSON>): BoxBox {
  const vb0 = viewbox.features[0].geometry.coordinates
  const [x, y] = vSub(vb0[1] as unknown as V, vb0[0] as unknown as V)

  const vb1 = viewbox.features[1].geometry.coordinates
  const [width, height] = vSub(vb1[1] as unknown as V, vb1[0] as unknown as V)

  return { x, y, width, height }
}

export function calcScale(mapData: Readonly<MapData>): {
  mapCoord: {
    fromGeo: (pgeo: VecVec) => VecVec
    toGeo: (pgeo: VecVec) => VecVec
  }
  mapViewBox: BoxBox
} {
  const o = vecFromV(
    mapData.origin.features[0].geometry.coordinates as unknown as V
  )

  const p = mapData.measures.features[0]
  const q = mapData.measures.features[1]

  const dist = vecVec(
    p.properties.ellipsoidal_distance,
    q.properties.ellipsoidal_distance
  )

  const pq = vecVec(p.geometry.coordinates[1][0], q.geometry.coordinates[1][1])

  const len = vecSub(pq, o)

  const distScale = vecDiv(dist, len)

  // XXX svg <-> geo coordinate
  // XXX XXX use matrix

  const fromGeo = (pgeo: VecVec): VecVec => vecMul(vecSub(pgeo, o), distScale)
  const toGeo = (psvg: VecVec): VecVec => vecAdd(vecDiv(psvg, distScale), o)
  const mapViewBox: BoxBox = boxScale(getViewBox(mapData.viewbox), distScale)

  return {
    mapCoord: {
      fromGeo: fromGeo,
      toGeo: toGeo,
    },
    mapViewBox,
  }
}

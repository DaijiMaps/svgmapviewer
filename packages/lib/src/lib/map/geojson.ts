import { BoxBox, boxScale } from '../box/prefixed'
import { V } from '../matrix'
import { Vsub } from '../matrix/v'
import {
  vecAdd,
  vecDiv,
  vecFromV,
  vecMul,
  vecSub,
  vecVec,
  VecVec,
} from '../vec/prefixed'
import { MapData } from './data'
import { LineGeoJSON } from './geojson-types'

function getViewBox(viewbox: Readonly<LineGeoJSON>): BoxBox {
  const vb0 = viewbox.features[0].geometry.coordinates
  const [x, y] = Vsub(vb0[1] as V, vb0[0] as V)

  const vb1 = viewbox.features[1].geometry.coordinates
  const [width, height] = Vsub(vb1[1] as V, vb1[0] as V)

  return { x, y, width, height }
}

export function calcScale(mapData: Readonly<MapData>) {
  const o = vecFromV(mapData.origin.features[0].geometry.coordinates as V)

  const p = mapData.measures.features[0]
  const q = mapData.measures.features[1]

  const dist = vecVec(p.properties.length, q.properties.length)

  const pq = vecVec(p.geometry.coordinates[1][0], q.geometry.coordinates[1][1])

  const len = vecSub(pq, o)

  const distScale = vecDiv(dist, len)

  // XXX svg <-> geo coordinate
  // XXX XXX use matrix

  const fromGeo = (pgeo: VecVec) => vecMul(vecSub(pgeo, o), distScale)
  const toGeo = (psvg: VecVec) => vecAdd(vecDiv(psvg, distScale), o)
  const mapViewBox = boxScale(getViewBox(mapData.viewbox), distScale)

  return {
    mapCoord: {
      fromGeo: fromGeo,
      toGeo: toGeo,
    },
    mapViewBox,
  }
}

export function Vwrap(f: (p: V) => V): (p: VecVec) => VecVec {
  return function (v: VecVec): VecVec {
    const [x, y] = f([v.x, v.y])
    return { x, y }
  }
}

export function Vunwrap(f: (p: VecVec) => VecVec): (p: V) => V {
  return function ([x, y]: V): V {
    const r = f({ x, y })
    return [r.x, r.y]
  }
}

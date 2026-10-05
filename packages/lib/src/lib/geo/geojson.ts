import { boxScale, boxUnit, type BoxBox } from '../box/prefixed'
import { vSub, type V } from '../tuple'
import { vecDiv, vecFromV, vecSub, vecVec, type VecVec } from '../vec/prefixed'
import { type MapCoord, type OsmMapData } from './data-types'
import { type LineStringGeoJSON } from './geojson-types'

function getViewBox(viewbox: Readonly<LineStringGeoJSON>): BoxBox {
  const vb0 = viewbox.features[0].geometry.coordinates
  const [x, y] = vSub(vb0[1] as unknown as V, vb0[0] as unknown as V)

  const vb1 = viewbox.features[1].geometry.coordinates
  const [width, height] = vSub(vb1[1] as unknown as V, vb1[0] as unknown as V)

  return { x, y, width, height }
}

// XXX
// XXX DOMMatrixReadonly
// XXX
export function calcScale({
  origin,
  measures,
  viewbox,
}: Readonly<OsmMapData>): {
  mapCoord: MapCoord
  mapViewBox: BoxBox
} {
  const o: VecVec = vecFromV(
    origin.features[0].geometry.coordinates as unknown as V
  )

  const fp = measures.features[0]
  const fq = measures.features[1]

  const p: VecVec = vecFromV(fp.geometry.coordinates[1] as unknown as V)
  const q: VecVec = vecFromV(fq.geometry.coordinates[1] as unknown as V)

  // 1m == svg 1px
  const diagsvg = vecVec(
    fp.properties.ellipsoidal_distance,
    fq.properties.ellipsoidal_distance
  )
  const diaggeo = vecVec(p.x - o.x, q.y - o.y)

  const diagScale = vecDiv(diagsvg, diaggeo)

  // XXX svg <-> geo coordinate
  // XXX XXX use matrix

  const geoToSvgMatrix = calcMatrix(o, diagScale)

  const mapViewBox: BoxBox = boxScale(getViewBox(viewbox), diagScale)

  return {
    mapCoord: {
      matrix: geoToSvgMatrix,
    },
    mapViewBox,
  }
}

export function calcMatrix(o: VecVec, diagScale: VecVec): DOMMatrixReadOnly {
  const m = new DOMMatrixReadOnly()
    .scale(diagScale.x, diagScale.y)
    .translate(-o.x, -o.y)
  return m
}

// for floors

export function calcScale2(
  svgp: VecVec,
  svgq: VecVec,
  geop: VecVec,
  geoq: VecVec
): {
  mapCoord: MapCoord
  mapViewBox: BoxBox
} {
  const m = calcMatrix2(svgp, svgq, geop, geoq)
  const mapViewBox: BoxBox = boxUnit
  return {
    mapCoord: {
      matrix: m,
    },
    mapViewBox,
  }
}

export function calcMatrix2(
  svgp: VecVec,
  svgq: VecVec,
  geop: VecVec,
  geoq: VecVec
): DOMMatrixReadOnly {
  const dsvg = vecSub(svgq, svgp)
  const dgeo = vecSub(geoq, geop)
  const s = vecDiv(dsvg, dgeo)
  const m = new DOMMatrixReadOnly()
    .translate(svgp.x, svgp.y)
    .scale(s.x, s.y)
    .translate(-geop.x, -geop.y)
  return m
}

import { type BoxBox, boxScale } from '../box/prefixed'
import { type V, vSub } from '../tuple'
import { vecDiv, vecFromV, vecVec } from '../vec/prefixed'
import { type MapCoord, type OsmMapData } from './data-types'
import { type LineGeoJSON } from './geojson-types'

function getViewBox(viewbox: Readonly<LineGeoJSON>): BoxBox {
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
  const o = vecFromV(origin.features[0].geometry.coordinates as unknown as V)

  const fp = measures.features[0]
  const fq = measures.features[1]

  const p = vecFromV(fp.geometry.coordinates[1] as unknown as V)
  const q = vecFromV(fq.geometry.coordinates[1] as unknown as V)

  // 1m == svg 1px
  const distsvg = vecVec(
    fp.properties.ellipsoidal_distance,
    fq.properties.ellipsoidal_distance
  )
  const distgeo = vecVec(p.x - o.x, q.y - o.y)

  const distScale = vecDiv(distsvg, distgeo)

  // XXX svg <-> geo coordinate
  // XXX XXX use matrix

  const geoToSvgMatrix = new DOMMatrixReadOnly()
    .scale(distScale.x, distScale.y)
    .translate(-o.x, -o.y)

  const mapViewBox: BoxBox = boxScale(getViewBox(viewbox), distScale)

  return {
    mapCoord: {
      matrix: geoToSvgMatrix,
    },
    mapViewBox,
  }
}

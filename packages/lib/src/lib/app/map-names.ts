import { svgMapViewerConfig as cfg } from '@daijimaps/svgmapviewer'
import {
  MultiPolygonFeature,
  OsmPointProperties,
  OsmPolygonProperties,
  POI,
  PointFeature,
} from '@daijimaps/svgmapviewer/geo'
import { V, vUnvec, vVec } from '@daijimaps/svgmapviewer/tuple'

//// mapHtmlStyle
//// mapSymbols
//// mapNames

export const mapHtmlStyle = `
.poi-stars {
  font-size: x-large;
}
.poi-names {
  font-size: small;
}
.poi-stars-item {
  position: absolute;
  padding: 0;
  text-align: center;
}
.poi-names-item {
  position: absolute;
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.375);
  text-align: center;
  border-radius: 5em;
}
.poi-symbols-item > p,
.poi-stars-item > p,
.poi-names-item > p {
  margin: 0;
}
.poi-symbols-item {
  position: absolute;
  font-size: 1.5em;
  color: white;
  background-color: black;
  border-radius: 0.05em;
}
.poi-symbols-item > p > span {
  display: block;
}
`

export const mapSymbols: POI[] = []

type PointOrCentroidFeature =
  | PointFeature<OsmPointProperties>
  | PointFeature<OsmPolygonProperties>
  | MultiPolygonFeature<OsmPolygonProperties>

const pointNames: POI[] = cfg.mapData.points.features.flatMap((f) => {
  const id = Number(f.properties.osm_id ?? '')
  const name = filterName(f)
  const pos = vVec(conv(f.geometry.coordinates as unknown as V))
  const area = 100 // XXX
  return name === null
    ? []
    : [{ id: id === 0 ? null : id, name: splitName(name), pos, size: 1, area }]
})

const centroidNames: POI[] = cfg.mapData.multipolygons.features.flatMap((f) => {
  const id = Number(
    (f.properties.osm_id ?? '') + (f.properties.osm_way_id ?? '')
  )
  const name = filterName(f)
  if (f.properties.centroid_x === null || f.properties.centroid_y === null) {
    return []
  }
  const centroid: V = [f.properties.centroid_x, f.properties.centroid_y]
  const pos = vVec(conv(centroid))
  const area =
    'area' in f.properties && f.properties.area !== null
      ? f.properties.area
      : undefined
  return name === null
    ? []
    : [{ id: id === 0 ? null : id, name: splitName(name), pos, size: 10, area }]
})

export const mapNames: POI[] = [...pointNames, ...centroidNames]

function filterName(f: Readonly<PointOrCentroidFeature>): null | string {
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
  return vUnvec(cfg.mapCoord.fromGeo(vVec(p)))
}

import { svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import {
  Line,
  LineFeature,
  lineToPath,
  MultiPolygon,
  MultiPolygonFeature,
  multiPolygonToPath,
  OsmLineProperties,
  OsmPointProperties,
  OsmPolygonProperties,
  PointFeature,
  PointGeoJSON,
} from '@daijimaps/svgmapviewer/map'
import { V, vUnvec, vVec } from '@daijimaps/svgmapviewer/tuple'
import { Assets } from './map-assets'
import { trees } from './map-data'
import './map.css'

export function RenderMap() {
  return (
    <>
      <Assets />
      <g id={svgMapViewerConfig.map} className="map">
        <g>
          <Areas />
          <Buildings />
          <Waters />
          <Streams />
          <Services />
          <PedestrianAreas />
          <Footways />
          <Steps />
          <Forests />
        </g>
        <Objects />
        <Facilities />
      </g>
    </>
  )
}

function Areas() {
  const xs: MultiPolygon[] = svgMapViewerConfig.mapData.areas.features.map(
    (f) => f.geometry.coordinates
  ) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="area" d={d} />
}

function Buildings() {
  const xs: MultiPolygon[] = svgMapViewerConfig.mapData.multipolygons.features
    .filter((f) => f.properties.building !== null)
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="building" d={d} />
}

function PedestrianAreas() {
  const xs: MultiPolygon[] = svgMapViewerConfig.mapData.multipolygons.features
    .filter((f) => f.properties.other_tags?.match(/"pedestrian"/))
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="pedestrian-area" d={d} />
}

function Waters() {
  const xs = svgMapViewerConfig.mapData.multipolygons.features
    .filter((f) => f.properties.natural === 'water')
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="water" d={d} />
}

function Streams() {
  const xs = svgMapViewerConfig.mapData.lines.features
    .filter((f) => f.properties.waterway === 'stream')
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="stream" d={d} />
}

function Forests() {
  const xs = svgMapViewerConfig.mapData.multipolygons.features
    .filter((f) => f.properties.landuse === 'forest')
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="forest" d={d} />
}

function Services() {
  const xs = svgMapViewerConfig.mapData.lines.features
    .filter((f) => f.properties.highway === 'service')
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="service" d={d} />
}

/*
function Bridges() {
  const xs = svgMapViewerConfig.mapData.lines.features
    .filter(
      (f) =>
        (f.properties.highway === 'footway' ||
          f.properties.highway === 'pedestrian') &&
        f.properties.other_tags?.match(/"bridge"/)
    )
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="footway-bridge" d={d} />
}
*/

function Footways() {
  const xs = svgMapViewerConfig.mapData.lines.features
    .filter(
      (f) =>
        f.properties.highway === 'footway' ||
        f.properties.highway === 'pedestrian'
    )
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="footway" d={d} />
}

function Steps() {
  const xs = svgMapViewerConfig.mapData.lines.features
    .filter((f) => f.properties.highway === 'steps')
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return (
    <g className="steps">
      <path className="bg" d={d} />
      <path className="fg" d={d} />
    </g>
  )
}

function Objects() {
  return (
    <g>
      <Benches />
      <GuidePosts />
      <InfoBoards />
      <Trees />
    </g>
  )
}

function Benches() {
  const re = /"bench"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  return <RenderUses href="#Xbench" vs={vs} />
}

function GuidePosts() {
  const re = /"guidepost"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  return <RenderUses href="#Xguide-post" vs={vs} />
}

function InfoBoards() {
  const re = /"information"=>"(board|map)"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  return <RenderUses href="#Xinfo-boards" vs={vs} />
}

function Trees() {
  const re = /"tree"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  const vs2 = (trees as PointGeoJSON).features
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
  return (
    <>
      <RenderUses href="#Xtree-16x16" vs={vs} />
      <RenderUses href="#Xtree-4x8" vs={vs2} />
    </>
  )
}

function Facilities() {
  return (
    <g>
      <Toilets />
      <Parkings />
    </g>
  )
}

function Toilets() {
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(/"toilets"/),
    centroids: (f) =>
      !!f.properties.other_tags?.match(/"toilets"/) ||
      f.properties.amenity === 'toilets',
  })
  return <RenderUses href="#XToilets" vs={vs} />
}

function Parkings() {
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(/"parking"/),
    centroids: (f) => !!f.properties.other_tags?.match(/"parking"/),
  })

  return <RenderUses href="#XParking" vs={vs} />
}

function RenderUses(props: { href: string; vs: V[] }) {
  return (
    <>
      {props.vs.map(([x, y], idx) => (
        <use key={idx} href={props.href} x={x} y={y} />
      ))}
    </>
  )
}

/*
function Labels() {
  const re = /"tree"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  const d = vs
    .map(
      ([x, y]) => `M${x},${y} m7.5,0 a7.5,7.5 0,0,1 -15,0a7.5,7.5 0,1,1 15,0z`
    )
    .join('')
  return (
    <g>
      <path d={d} fill="white" fillOpacity="0.5" />
      <text>
        {vs.map(([x, y], idx) => (
          <>
            <tspan key={idx*4+0} x={x} y={y + 0.9 - 3.75}>
              日本語
            </tspan>
            <tspan key={idx*4+1} x={x} y={y + 0.9}>
              テスト
            </tspan>
            <tspan key={idx*4+2} x={x} y={y + 0.9 + 3.75}>
              123
            </tspan>
          </>
        ))}
      </text>
    </g>
  )
}
*/

type PointsFilter = (f: PointFeature<OsmPointProperties>) => boolean
type LinesFilter = (f: LineFeature<OsmLineProperties>) => boolean
type MultiPolygonsFilter = (
  f: MultiPolygonFeature<OsmPolygonProperties>
) => boolean
type CentroidsFilter = (f: PointFeature<OsmPolygonProperties>) => boolean

interface Filters {
  points?: PointsFilter
  lines?: LinesFilter
  multipolygons?: MultiPolygonsFilter
  centroids?: CentroidsFilter
}

const getAll = ({ points, lines, multipolygons, centroids }: Filters) =>
  [
    points === undefined ? [] : getPoints(points),
    lines === undefined ? [] : getLines(lines),
    multipolygons === undefined ? [] : getMultiPolygons(multipolygons),
    centroids === undefined ? [] : getCentroids(centroids),
  ].flatMap((vs) => vs)

const getPoints = (filter: PointsFilter) =>
  svgMapViewerConfig.mapData.points.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
const getLines = (filter: LinesFilter) =>
  svgMapViewerConfig.mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
const getMultiPolygons = (filter: MultiPolygonsFilter) =>
  svgMapViewerConfig.mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
const getCentroids = (filter: CentroidsFilter) =>
  svgMapViewerConfig.mapData.centroids.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)

function conv(p: V): V {
  return vUnvec(svgMapViewerConfig.mapCoord.fromGeo(vVec(p)))
}

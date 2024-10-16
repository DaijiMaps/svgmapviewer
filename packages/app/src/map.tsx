import { svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import {
  Line,
  lineToPath,
  MultiPolygon,
  multiPolygonToPath,
  PointGeoJSON,
} from '@daijimaps/svgmapviewer/map'
import { V } from '@daijimaps/svgmapviewer/tuple'
import { Assets } from './map-assets'
import { conv, getAll, trees } from './map-data'
import './map.css'
import { BenchPath } from './objects/bench'
import { GuidePostPath } from './objects/guide-post'
import { InfoBoardPath } from './objects/info-board'
import { Tree16x16Path, Tree4x8Path } from './objects/tree'

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
  return <RenderObjects width={0.05} path={BenchPath} vs={vs} />
}

function GuidePosts() {
  const re = /"guidepost"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  return <RenderObjects width={0.05} path={GuidePostPath} vs={vs} />
}

function InfoBoards() {
  const re = /"information"=>"(board|map)"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  return <RenderObjects width={0.05} path={InfoBoardPath} vs={vs} />
}

function Trees() {
  const re = /"tree"|"wood"/
  const vs = getAll({
    points: (f) => !!f.properties.other_tags?.match(re),
  })
  const vs2 = (trees as PointGeoJSON).features
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
  return (
    <>
      <RenderObjects width={0.3} path={Tree16x16Path} vs={vs} />
      <RenderObjects width={0.15} path={Tree4x8Path} vs={vs2} />
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

function RenderObjects(props: { width: number; path: string; vs: V[] }) {
  return (
    <path
      fill="none"
      stroke="black"
      strokeWidth={props.width}
      d={props.vs.map(([x, y]) => `M ${x},${y}` + props.path).join('')}
    />
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

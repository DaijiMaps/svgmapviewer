import './Map.css'
import { svgMapViewerConfig } from './lib/config'
import {
  Line,
  lineToPath,
  mapData,
  MultiPolygon,
  multiPolygonToPath,
  Point,
  r,
} from './lib/map/geojson'
import { V } from './lib/matrix'

export function RenderMap() {
  return (
    <>
      <path
        id="Xbench"
        d="M -0.7,0 V -0.4 M 0.7,0 v -0.4 m 0.3,0 h -2"
        fill="none"
        stroke="black"
        strokeWidth="0.05"
      />
      <path
        id="Xguide-post"
        d="m 0,0 v -1.4 h -0.7 m 0,0.6 H 0 m 0,-0.3 h 0.7"
        fill="none"
        stroke="black"
        strokeWidth="0.05"
      />
      <g id={svgMapViewerConfig.map} className="map">
        <Areas />
        <Buildings />
        <PedestrianAreas />
        <Waters />
        <Streams />
        <Services />
        <Bridges />
        <Footways />
        <Steps />
        <Benches />
        <GuidePosts />
      </g>
    </>
  )
}

function Areas() {
  const xs: MultiPolygon[] = mapData.areas.features.map(
    (f) => f.geometry.coordinates
  ) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="area" d={d} />
}

function Buildings() {
  const xs: MultiPolygon[] = mapData.multipolygons.features
    .filter((f) => f.properties.building !== null)
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="building" d={d} />
}

function PedestrianAreas() {
  const xs: MultiPolygon[] = mapData.multipolygons.features
    .filter((f) => f.properties.other_tags?.match(/"pedestrian"/))
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="pedestrian-area" d={d} />
}

function Waters() {
  const xs = mapData.multipolygons.features
    .filter((f) => f.properties.natural === 'water')
    .map((f) => f.geometry.coordinates) as MultiPolygon[]

  const d = xs.map(multiPolygonToPath).join('')

  return <path className="water" d={d} />
}

function Streams() {
  const xs = mapData.lines.features
    .filter((f) => f.properties.waterway === 'stream')
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="stream" d={d} />
}

function Services() {
  const xs = mapData.lines.features
    .filter((f) => f.properties.highway === 'service')
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="service" d={d} />
}

function Bridges() {
  const xs = mapData.lines.features
    .filter(
      (f) =>
        f.properties.highway === 'footway' &&
        f.properties.other_tags?.match(/"bridge"/)
    )
    .map((f) => f.geometry.coordinates) as Line[]

  const d = xs.map(lineToPath).join('')

  return <path className="footway-bridge" d={d} />
}

function Footways() {
  const xs = mapData.lines.features
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
  const xs = mapData.lines.features
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

function Benches() {
  const xs = mapData.points.features
    .filter((f) => f.properties.other_tags?.match(/"bench"/) ?? false)
    .map((f) => f.geometry.coordinates as V)
    .map(r) as Point[]

  return (
    <>
      {xs.map(([vx, vy], idx) => (
        <use key={idx} href="#Xbench" x={vx} y={vy} />
      ))}
    </>
  )
}

function GuidePosts() {
  const xs = mapData.points.features
    .filter((f) => f.properties.other_tags?.match(/"guidepost"/) ?? false)
    .map((f) => f.geometry.coordinates as V)
    .map(r) as Point[]

  return (
    <>
      {xs.map(([vx, vy], idx) => (
        <use key={idx} href="#Xguide-post" x={vx} y={vy} />
      ))}
    </>
  )
}

import { svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import {
  Line,
  lineToPath,
  MultiPolygon,
  multiPolygonToPath,
  Point,
  Vunwrap,
} from '@daijimaps/svgmapviewer/map'
import { matrixV as V } from '@daijimaps/svgmapviewer/matrix'
import { Assets } from './map-assets'
import './map.css'

export function RenderMap() {
  return (
    <>
      <Assets />
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
      <path
        id="Xinfo-board"
        d="M -0.4,0 V -0.7 M 0.4,0 v -0.7 m 0.1,0 h -1 v -0.7 h 1 z"
        fill="none"
        stroke="black"
        strokeWidth="0.05"
      />
      <g id={svgMapViewerConfig.map} className="map">
        <Areas />
        <Buildings />
        <Waters />
        <Streams />
        <Services />
        <PedestrianAreas />
        <Footways />
        <Steps />
        <Forests />
        <Benches />
        <GuidePosts />
        <InfoBoards />
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

function Benches() {
  const xs = svgMapViewerConfig.mapData.points.features
    .filter((f) => f.properties.other_tags?.match(/"bench"/))
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]

  return (
    <>
      {xs.map(([vx, vy], idx) => (
        <use key={idx} href="#Xbench" x={vx} y={vy} />
      ))}
    </>
  )
}

function GuidePosts() {
  const xs = svgMapViewerConfig.mapData.points.features
    .filter((f) => f.properties.other_tags?.match(/"guidepost"/))
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]

  return (
    <>
      {xs.map(([vx, vy], idx) => (
        <use key={idx} href="#Xguide-post" x={vx} y={vy} />
      ))}
    </>
  )
}

function InfoBoards() {
  const re = /"information"=>"(board|map)"/
  const xs = svgMapViewerConfig.mapData.points.features
    .filter((f) => f.properties.other_tags?.match(re))
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]

  return (
    <>
      {xs.map(([vx, vy], idx) => (
        <use key={idx} href="#Xinfo-board" x={vx} y={vy} />
      ))}
    </>
  )
}

function Facilities() {
  const toilets = svgMapViewerConfig.mapData.points.features
    .filter((f) => f.properties.other_tags?.match(/"toilets"/))
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]
  const toilets2 = svgMapViewerConfig.mapData.centroids.features
    .filter(
      (f) =>
        f.properties.other_tags?.match(/"toilets"/) ||
        f.properties.amenity === 'toilets'
    )
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]
  const parkings = svgMapViewerConfig.mapData.points.features
    .filter((f) => f.properties.other_tags?.match(/"parking"/))
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]
  const parkings2 = svgMapViewerConfig.mapData.centroids.features
    .filter((f) => f.properties.other_tags?.match(/"parking"/))
    .map((f) => f.geometry.coordinates as V)
    .map(conv) as Point[]

  return (
    <>
      {toilets.map(([vx, vy], idx) => (
        <use key={idx} href="#XToilets" x={vx} y={vy} />
      ))}
      {toilets2.map(([vx, vy], idx) => (
        <use key={idx} href="#XToilets" x={vx} y={vy} />
      ))}
      {parkings.map(([vx, vy], idx) => (
        <use key={idx} href="#XParking" x={vx} y={vy} />
      ))}
      {parkings2.map(([vx, vy], idx) => (
        <use key={idx} href="#XParking" x={vx} y={vy} />
      ))}
    </>
  )
}

function conv(p: V): V {
  return Vunwrap(svgMapViewerConfig.mapCoord.fromGeo)(p)
}

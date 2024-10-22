import { RenderMapProps, svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import {
  MapLayer,
  MapMarkers,
  MapObjects,
  MapSymbols,
  RenderMapLayers,
  RenderMapMarkers,
  RenderMapObjects,
  RenderMapSymbols,
} from '@daijimaps/svgmapviewer/carto'
import { MultiPolygon, PointGeoJSON } from '@daijimaps/svgmapviewer/geo'
import { V } from '@daijimaps/svgmapviewer/tuple'
import { RenderMapAssets } from './map-assets'
import { conv, getAll, trees } from './map-data'
import './map.css'
import { BenchPath } from './objects/bench'
import { GuidePostPath } from './objects/guide-post'
import { InfoBoardPath } from './objects/info-board'
import { Tree16x16Path, Tree4x8Path } from './objects/tree'

export function RenderMap(props: RenderMapProps) {
  return (
    <>
      <RenderMapAssets />
      <g id={svgMapViewerConfig.map} className="map">
        <RenderMapLayers mapLayers={getMapLayers()} />
        <RenderMapObjects mapObjects={getMapObjects()} />
        <RenderMapSymbols {...props} mapSymbols={getMapSymbols()} />
        <RenderMapMarkers {...props} mapMarkers={getMapMarkers()} />
      </g>
    </>
  )
}

const getMapLayers: () => MapLayer[] = () => [
  {
    type: 'multipolygon',
    name: 'area',
    data: svgMapViewerConfig.mapData.areas.features.map(
      (f) => f.geometry.coordinates
    ) as unknown as MultiPolygon[],
  },
  {
    type: 'multipolygon',
    name: 'water',
    filter: (f) => !!f.properties.natural?.match(/^water$/),
  },
  {
    type: 'line',
    name: 'stream',
    filter: (f) => !!f.properties.waterway?.match(/^(stream|ditch)$/),
  },
  {
    type: 'multipolygon',
    name: 'forest',
    filter: (f) => !!f.properties.landuse?.match(/forest/),
  },
  {
    type: 'multipolygon',
    name: 'building',
    filter: (f) => !!f.properties.building?.match(/./),
  },
  {
    type: 'line',
    name: 'service',
    filter: (f) => !!f.properties.highway?.match(/^(service)$/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (f) => !!f.properties.other_tags?.match(/"pedestrian"/),
  },
  {
    type: 'line',
    name: 'footway',
    filter: (f) =>
      !!f.properties.highway?.match(/^(footway|path|pedestrian|steps)$/),
  },
  {
    type: 'line',
    name: 'wall',
    filter: (f) => !!f.properties.barrier?.match(/^(wall|fence)$/),
  },
]

const getMapObjects: () => MapObjects[] = () => [
  {
    name: 'benches',
    path: BenchPath,
    width: 0.05,
    vs: getAll({
      points: (f) => !!f.properties.other_tags?.match(/"bench"/),
    }),
  },
  {
    name: 'guide-posts',
    path: GuidePostPath,
    width: 0.05,
    vs: getAll({
      points: (f) => !!f.properties.other_tags?.match(/"guidepost"/),
    }),
  },
  {
    name: 'info-boards',
    path: InfoBoardPath,
    width: 0.05,
    vs: getAll({
      points: (f) =>
        !!f.properties.other_tags?.match(/"information"=>"(board|map)"/),
    }),
  },
  {
    name: 'trees1',
    path: Tree16x16Path,
    width: 0.3,
    vs: getAll({
      points: (f) => !!f.properties.other_tags?.match(/"tree"/),
    }),
  },
  {
    name: 'trees2',
    path: Tree4x8Path,
    width: 0.15,
    vs: (trees as PointGeoJSON).features
      .map((f) => f.geometry.coordinates as unknown as V)
      .map(conv),
  },
]

const getMapSymbols: () => MapSymbols[] = () => [
  {
    name: 'toilets',
    href: '#XToilets',
    vs: getAll({
      points: (f) => !!f.properties.other_tags?.match(/"toilets"/),
      centroids: (f) =>
        !!f.properties.other_tags?.match(/"toilets"/) ||
        f.properties.amenity === 'toilets',
    }),
  },
  {
    name: 'parkings',
    href: '#XParking',
    vs: getAll({
      points: (f) => !!f.properties.other_tags?.match(/"parking"/),
      centroids: (f) => !!f.properties.other_tags?.match(/"parking"/),
    }),
  },
]

const getMapMarkers: () => MapMarkers[] = () => [
  {
    name: 'all',
    vs: getAll({
      points: (f) => !!f.properties.name?.match(/./),
    }),
  },
]

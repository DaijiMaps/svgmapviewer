import { RenderMapProps, svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import {
  MapLayer,
  MapMarkers,
  MapObjects,
  MapSymbols,
  RenderMapCommon,
} from '@daijimaps/svgmapviewer/carto'
import {
  benchPath,
  guidePostPath,
  infoBoardPath,
  tree16x16Path,
  tree4x8Path,
} from '@daijimaps/svgmapviewer/carto-objects'
import { MultiPolygon, PointGeoJSON } from '@daijimaps/svgmapviewer/geo'
import { V } from '@daijimaps/svgmapviewer/tuple'
import { conv, trees } from './map-data'
import './map.css'

export function RenderMap(props: RenderMapProps) {
  const ops = {
    getMapLayers,
    getMapObjects,
    getMapSymbols,
    getMapMarkers,
  }
  return <RenderMapCommon {...props} {...ops} />
}

export const getMapLayers: () => MapLayer[] = () => [
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
  {
    type: 'line',
    name: 'retaining-wall',
    filter: (f) => !!f.properties.barrier?.match(/^(retaining_wall)$/),
  },
]

export const getMapObjects: () => MapObjects[] = () => [
  {
    name: 'benches',
    path: benchPath,
    width: 0.05,
    pointsFilter: (f) => !!f.properties.other_tags?.match(/"bench"/),
  },
  {
    name: 'guide-posts',
    path: guidePostPath,
    width: 0.05,
    pointsFilter: (f) => !!f.properties.other_tags?.match(/"guidepost"/),
  },
  {
    name: 'info-boards',
    path: infoBoardPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"information"=>"(board|map)"/),
  },
  {
    name: 'trees1',
    path: tree16x16Path,
    width: 0.3,
    pointsFilter: (f) => !!f.properties.other_tags?.match(/"tree"/),
  },
  {
    name: 'trees2',
    path: tree4x8Path,
    width: 0.15,
    data: (trees as PointGeoJSON).features
      .map((f) => f.geometry.coordinates as unknown as V)
      .map(conv),
  },
]

export const getMapSymbols: () => MapSymbols[] = () => [
  {
    name: 'toilets',
    href: '#XToilets',
    pointsFilter: (f) => !!f.properties.other_tags?.match(/"toilets"/),
    centroidsFilter: (f) =>
      !!f.properties.other_tags?.match(/"toilets"/) ||
      f.properties.amenity === 'toilets',
  },
  {
    name: 'parkings',
    href: '#XParking',
    pointsFilter: (f) => !!f.properties.other_tags?.match(/"parking"/),
    centroidsFilter: (f) => !!f.properties.other_tags?.match(/"parking"/),
  },
]

export const getMapMarkers: () => MapMarkers[] = () => [
  {
    name: 'all',
    pointsFilter: (f) => !!f.properties.name?.match(/./),
  },
]

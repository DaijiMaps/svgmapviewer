import {
  MapLayer,
  MapMarkers,
  MapObjects,
  MapSymbols,
} from '@daijimaps/svgmapviewer/carto'
import {
  benchPath,
  guidePostPath,
  infoBoardPath,
  monumentPath,
  statuePath,
  toriiPath,
  tree16x16Path,
  tree4x8Path,
} from '@daijimaps/svgmapviewer/carto-objects'
import { MultiPolygon, PointGeoJSON } from '@daijimaps/svgmapviewer/geo'
import { V } from '@daijimaps/svgmapviewer/tuple'
import internals from './data/internals.json'
import { conv, trees } from './map-data'
import './Map.css'

export const getMapLayers: () => MapLayer[] = () => [
  {
    type: 'multipolygon',
    name: 'area',
    data: internals.features.map(
      (f) => f.geometry.coordinates
    ) as unknown as MultiPolygon[],
  },
  {
    type: 'multipolygon',
    name: 'forest',
    filter: (f) =>
      !!f.properties.landuse?.match(/forest/) ||
      !!f.properties.natural?.match(/wood/),
  },
  {
    type: 'multipolygon',
    name: 'water',
    filter: (f) => !!f.properties.natural?.match(/^water$/),
  },
  {
    type: 'line',
    name: 'ditch',
    filter: (f) =>
      !!f.properties.waterway?.match(/^(ditch)$/) &&
      !f.properties.other_tags?.match(/"tunnel"=>"(yes|culvert)"/),
  },
  {
    type: 'line',
    name: 'stream',
    filter: (f) =>
      !!f.properties.waterway?.match(/^(stream)$/) &&
      !f.properties.other_tags?.match(/"tunnel"=>"(yes|culvert)"/),
  },
  {
    type: 'line',
    name: 'river',
    filter: (f) =>
      !!f.properties.waterway?.match(/^(river)$/) &&
      !f.properties.other_tags?.match(/"tunnel"=>"(yes|culvert)"/),
  },
  {
    type: 'multipolygon',
    name: 'building',
    filter: (f) => !!f.properties.building?.match(/./),
  },
  {
    type: 'line',
    name: 'footway',
    filter: (f) =>
      !!f.properties.highway?.match(/^(footway|path|pedestrian|steps)$/) &&
      !f.properties.other_tags?.match(/"tunnel"/),
  },
  {
    type: 'line',
    name: 'cycleway',
    filter: (f) =>
      !!f.properties.highway?.match(/^(cycleway)$/) &&
      !f.properties.other_tags?.match(/"tunnel"/),
  },
  {
    type: 'line',
    name: 'service',
    filter: (f) =>
      !!f.properties.highway?.match(/^(service)$/) &&
      !f.properties.other_tags?.match(/"tunnel"/),
  },
  {
    type: 'line',
    name: 'road',
    filter: (f) =>
      !!f.properties.highway?.match(/./) &&
      !f.properties.highway?.match(
        /^(footway|path|pedestrian|steps|cycleway|service)$/
      ) &&
      !f.properties.other_tags?.match(/"tunnel"/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (f) => !!f.properties.other_tags?.match(/"pedestrian"/),
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
  {
    name: 'torii',
    path: toriiPath,
    width: 0.075,
    pointsFilter: (f) => !!f.properties.man_made?.match(/^torii$/),
  },
  {
    name: 'monument',
    path: monumentPath,
    width: 0.075,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"historic"=>"memorial"/),
  },
  {
    name: 'statue',
    path: statuePath,
    width: 0.075,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"artwork_type"=>"statue"/),
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
  {
    name: 'drinking-fountain',
    href: '#XDrinkingFountain',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"amenity"=>"drinking_water"/),
  },
]

export const getMapMarkers: () => MapMarkers[] = () => [
  {
    name: 'all',
    pointsFilter: (f) => !!f.properties.name?.match(/./),
  },
]

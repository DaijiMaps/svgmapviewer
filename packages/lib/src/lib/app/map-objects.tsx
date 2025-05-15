import { MapObjects } from '@daijimaps/svgmapviewer/carto'
import {
  benchPath,
  entrancePath,
  guidePostPath,
  infoBoardPath,
  monumentPath,
  statuePath,
  toriiPath,
  tree4x8Path,
  vendingMachinePath,
  wasteBasketPath,
} from '@daijimaps/svgmapviewer/carto-objects'
import './map.css'

export const getMapObjects: () => MapObjects[] = () => [
  {
    name: 'benches',
    path: benchPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"bench"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'entrances',
    path: entrancePath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"entrance"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'guide-posts',
    path: guidePostPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"guidepost"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'info-boards',
    path: infoBoardPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"information"=>"(board|map)"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'trees1',
    path: tree4x8Path,
    width: 0.15,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"tree"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'torii',
    path: toriiPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.man_made?.match(/^torii$/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'monument',
    path: monumentPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"historic"=>"memorial"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'statue',
    path: statuePath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"artwork_type"=>"statue"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'vending-machine',
    path: vendingMachinePath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"amenity"=>"vending_machine"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'waste-basket',
    path: wasteBasketPath,
    width: 0.05,
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"amenity"=>"waste_basket"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
]

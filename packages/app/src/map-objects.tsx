/* eslint-disable functional/functional-parameters */
import type { MapObjects } from '@daijimaps/svgmapviewer/carto'
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

export const getMapObjects: () => MapObjects[] = () => [
  {
    name: 'benches',
    path: benchPath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"bench"/),
  },
  {
    name: 'entrances',
    path: entrancePath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"entrance"/),
  },
  {
    name: 'guide-posts',
    path: guidePostPath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"guidepost"/),
  },
  {
    name: 'info-boards',
    path: infoBoardPath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"information"=>"(board|map)"/),
  },
  {
    name: 'trees1',
    path: tree4x8Path,
    width: 0.15,
    pointsFilter: (p) => !!p.other_tags?.match(/"tree"/),
  },
  {
    name: 'torii',
    path: toriiPath,
    width: 0.05,
    pointsFilter: (p) => !!p.man_made?.match(/^torii$/),
  },
  {
    name: 'monument',
    path: monumentPath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"historic"=>"memorial"/),
  },
  {
    name: 'statue',
    path: statuePath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"artwork_type"=>"statue"/),
  },
  {
    name: 'vending-machine',
    path: vendingMachinePath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"vending_machine"/),
  },
  {
    name: 'waste-basket',
    path: wasteBasketPath,
    width: 0.05,
    pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"waste_basket"/),
  },
]

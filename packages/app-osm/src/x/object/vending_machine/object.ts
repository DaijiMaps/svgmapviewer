import type { OsmMapObjects } from 'svgmapviewer/carto'
import { vendingMachinePath } from 'svgmapviewer/carto-objects'

export const vending_machine: OsmMapObjects = {
  name: 'vending-machine',
  path: vendingMachinePath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"vending_machine"/),
}

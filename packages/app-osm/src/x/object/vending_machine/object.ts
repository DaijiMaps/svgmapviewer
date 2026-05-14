import type { OsmMapObjects } from 'svgmapviewer/carto'
import { objectNames } from 'svgmapviewer/carto-objects'

export const vending_machine: OsmMapObjects = {
  name: 'vending-machine',
  path: objectNames.vending_machine,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"vending_machine"/),
}

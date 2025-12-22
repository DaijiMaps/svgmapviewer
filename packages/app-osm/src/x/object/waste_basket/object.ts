import type { OsmMapObjects } from 'svgmapviewer/carto'
import { wasteBasketPath } from 'svgmapviewer/carto-objects'

export const waste_basket: OsmMapObjects = {
  name: 'waste-basket',
  path: wasteBasketPath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"waste_basket"/),
}

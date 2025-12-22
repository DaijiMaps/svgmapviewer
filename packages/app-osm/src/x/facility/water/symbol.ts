import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const water: OsmMapSymbols = {
  name: 'drinking-fountains',
  href: '#XDrinkingFountain',
  pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"drinking_water"/),
}

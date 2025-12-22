import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const water: OsmMapSymbols = {
  name: 'drinking-fountains',
  href: '#Xwater',
  pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"drinking_water"/),
}

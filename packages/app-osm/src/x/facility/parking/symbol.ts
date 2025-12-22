import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const parking: OsmMapSymbols = {
  name: 'parkings',
  href: '#Xparking',
  pointsFilter: (p) => !!p.other_tags?.match(/"parking"/),
  polygonsFilter: (p) =>
    p.amenity === 'parking' || !!p.other_tags?.match(/"parking"/),
}

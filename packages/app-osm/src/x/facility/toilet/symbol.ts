import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const toilet: OsmMapSymbols = {
  name: 'toilets',
  href: '#XToilets',
  pointsFilter: (p) => !!p.other_tags?.match(/"toilets"/),
  polygonsFilter: (p) =>
    p.building === 'toilets' ||
    p.amenity === 'toilets' ||
    !!p.other_tags?.match(/"toilets"/),
}

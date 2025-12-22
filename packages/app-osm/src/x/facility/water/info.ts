import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const water: OsmSearchEntry = {
  // water
  filter: (properties) =>
    !!properties?.other_tags?.match(/"amenity"=>"drinking_water"/),
  getInfo: (properties, address) => ({
    title: 'water',
    x: {
      tag: 'facility',
      title: 'water',
      address: address,
      properties,
    },
  }),
}

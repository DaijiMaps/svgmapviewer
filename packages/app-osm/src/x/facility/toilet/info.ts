import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const toilet: OsmSearchEntry = {
  // toilets
  filter: (properties) => !!properties?.other_tags?.match(/"toilets"/),
  getInfo: (properties, address) => ({
    title: 'toilets',
    x: {
      tag: 'facility',
      title: 'toilets',
      address: address,
      properties,
    },
  }),
}

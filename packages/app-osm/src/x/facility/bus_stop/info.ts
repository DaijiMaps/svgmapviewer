import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const bus_stop: OsmSearchEntry = {
  // bus_stop
  filter: (properties) => !!properties?.other_tags?.match(/"bus_stop"/),
  getInfo: (properties, address) => ({
    title: 'bus_stop',
    x: {
      tag: 'facility',
      title: 'bus_stop',
      address: address,
      properties,
    },
  }),
}

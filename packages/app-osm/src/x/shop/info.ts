import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const shop: OsmSearchEntry = {
  // others (shop)
  filter: (properties) => !!properties.name?.match(/./),
  getInfo: (properties, address) => ({
    title: 'shop',
    x: { tag: 'shop', address, properties },
  }),
}

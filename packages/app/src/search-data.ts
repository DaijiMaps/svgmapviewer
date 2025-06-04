import type { SearchEntry } from '@daijimaps/svgmapviewer/geo'

export const searchEntries: SearchEntry[] = [
  {
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
  },
  {
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
  },
  {
    // others (shop)
    filter: (properties) => !!properties.name?.match(/./),
    getInfo: (properties, address) => ({
      title: 'shop',
      x: { tag: 'shop', address, properties },
    }),
  },
]

import { type OsmSearchEntry } from 'svgmapviewer/geo'

export const osmSearchEntries: OsmSearchEntry[] = [
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
    filter: (properties) =>
      'highway' in properties &&
      !!properties.highway?.match(/elevator/) &&
      !properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    getInfo: (properties, address) => ({
      title: 'elevator',
      x: {
        tag: 'facility',
        title: 'elevator',
        address: address,
        properties,
      },
    }),
  },
  {
    filter: (properties) =>
      'highway' in properties &&
      !!properties.highway?.match(/steps/) &&
      !!properties.other_tags?.match(/"conveying"=>"yes"/),
    getInfo: (properties, address) => ({
      title: 'elevator',
      x: {
        tag: 'facility',
        title: 'escalator',
        address: address,
        properties,
      },
    }),
  },
  {
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
  },
  {
    // information
    filter: (properties) =>
      !!properties.other_tags?.match(/"tourism"=>"information"/) &&
      !!properties.other_tags?.match(/"information"=>"office"/),
    getInfo: (properties, address) => ({
      title: 'information',
      x: {
        tag: 'facility',
        title: 'information',
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

import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const information: OsmSearchEntry = {
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
}

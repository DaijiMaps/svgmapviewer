import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const escalator: OsmSearchEntry = {
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
}

import type { OsmSearchEntry } from 'svgmapviewer/geo'

export const elevator: OsmSearchEntry = {
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
}

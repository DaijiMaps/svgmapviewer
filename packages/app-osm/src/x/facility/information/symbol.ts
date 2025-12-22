import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const information: OsmMapSymbols = {
  name: 'informations',
  href: '#Xinformation',
  pointsFilter: (p) =>
    !!p.other_tags?.match(/"tourism"=>"information"/) &&
    !!p.other_tags?.match(/"information"=>"office"/),
  polygonsFilter: (p) =>
    !!p.other_tags?.match(/"tourist"=>"information"/) &&
    !!p.other_tags?.match(/"information"=>"office"/),
}

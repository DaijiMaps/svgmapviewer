import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const escalator: OsmMapSymbols = {
  name: 'escalators',
  href: '#XEscalator',
  linesFilter: (p) =>
    !!p.highway?.match(/steps/) && !!p.other_tags?.match(/"conveying"=>"yes"/),
}

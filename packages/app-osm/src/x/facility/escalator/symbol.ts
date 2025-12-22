import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const escalator: OsmMapSymbols = {
  name: 'escalators',
  href: '#Xescalator',
  linesFilter: (p) =>
    !!p.highway?.match(/steps/) && !!p.other_tags?.match(/"conveying"=>"yes"/),
}

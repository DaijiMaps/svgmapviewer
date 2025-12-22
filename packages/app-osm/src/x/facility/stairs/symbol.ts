import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const stairsGetMapSymbols: OsmMapSymbols = {
  name: 'stairs',
  href: '#XStairs',
  linesFilter: (p) =>
    !!p.highway?.match(/steps/) &&
    !p.other_tags?.match(/"conveying"=>"yes"/) &&
    !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
}

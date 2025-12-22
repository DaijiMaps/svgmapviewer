import type { MapLinePaths } from 'svgmapviewer/carto'

export const escalator: MapLinePaths[] = [
  {
    type: 'line',
    name: 'escalator background',
    filter: (p) =>
      !!p.highway?.match(/^(steps)$/) &&
      !!p.other_tags?.match(/"conveying"=>"yes"/),
  },
  {
    type: 'line',
    name: 'escalator foreground',
    filter: (p) =>
      !!p.highway?.match(/^(steps)$/) &&
      !!p.other_tags?.match(/"conveying"=>"yes"/),
  },
]

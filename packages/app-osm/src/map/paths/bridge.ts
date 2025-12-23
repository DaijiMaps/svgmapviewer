import type { MapLinePathOps } from 'svgmapviewer/carto'

export const bridge: MapLinePathOps[] = [
  {
    type: 'line',
    name: 'bridge shadow',
    widthScale: 1.8,
    filter: (p) => !!p.other_tags?.match(/"bridge"/),
  },
  {
    type: 'line',
    name: 'bridge edge',
    widthScale: 1.4,
    filter: (p) => !!p.other_tags?.match(/"bridge"/),
  },
  {
    type: 'line',
    name: 'bridge road',
    filter: (p) => !!p.other_tags?.match(/"bridge"/),
  },
] as const

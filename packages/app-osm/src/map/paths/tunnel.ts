import type { MapLinePathOps } from 'svgmapviewer/carto'

export const tunnel: MapLinePathOps = {
  type: 'line',
  name: 'tunnel shadow',
  widthScale: 1.8,
  filter: (p) => !!p.highway?.match(/./) && !!p.other_tags?.match(/"tunnel"/),
}

import type { MapLinePaths } from 'svgmapviewer/carto'

export const tunnel: MapLinePaths = {
  type: 'line',
  name: 'tunnel shadow',
  widthScale: 1.8,
  filter: (p) => !!p.highway?.match(/./) && !!p.other_tags?.match(/"tunnel"/),
}

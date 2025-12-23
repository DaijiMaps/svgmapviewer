import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const pedestrian_area: MapMultiPolygonPathOps[] = [
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (p) =>
      !!p.other_tags?.match(/("highway"=>"service"|"area:highway"=>"service")/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (p) => !!p.man_made?.match(/bridge/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (p) => !!p.other_tags?.match(/"pedestrian"/),
  },
]

import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const playground: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'playground',
  filter: (p) =>
    !!p.tourism?.match(/zoo/) ||
    !!p.leisure?.match(/ice_rink|pitch|playground/) ||
    !!p.landuse?.match(/recreation_ground/),
}

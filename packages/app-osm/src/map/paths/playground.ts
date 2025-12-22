import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const playground: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'playground',
  filter: (p) =>
    !!p.tourism?.match(/zoo/) ||
    !!p.leisure?.match(/ice_rink|pitch|playground/) ||
    !!p.landuse?.match(/recreation_ground/),
}

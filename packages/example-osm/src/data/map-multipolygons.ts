import { type OsmMultiPolygonGeoJSON } from 'svgmapviewer/geo'

export const multipolygons: OsmMultiPolygonGeoJSON = {
  type: 'FeatureCollection',
  name: 'map-multipolygons',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  features: [],
}

export default multipolygons

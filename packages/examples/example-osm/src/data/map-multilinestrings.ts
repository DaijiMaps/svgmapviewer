import { type OsmMultiLineStringGeoJSON } from 'svgmapviewer/geo'

export const multilinestrings: OsmMultiLineStringGeoJSON = {
  type: 'FeatureCollection',
  name: 'map-multilinestrings',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  features: [],
}

export default multilinestrings

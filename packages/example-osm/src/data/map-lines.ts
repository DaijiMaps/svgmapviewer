import { type OsmLineGeoJSON } from 'svgmapviewer/geo'

export const lines: OsmLineGeoJSON = {
  type: 'FeatureCollection',
  name: 'map-lines',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  features: [],
}

export default lines

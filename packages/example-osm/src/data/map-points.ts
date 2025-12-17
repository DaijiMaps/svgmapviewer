import { type OsmPointGeoJSON } from 'svgmapviewer/geo'

export const points: OsmPointGeoJSON = {
  type: 'FeatureCollection',
  name: 'map-points',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  features: [],
}

export default points

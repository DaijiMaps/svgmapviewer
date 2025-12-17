import { type PointGeoJSON } from 'svgmapviewer/geo'

export const origin: PointGeoJSON = {
  type: 'FeatureCollection',
  name: 'origin',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [139.48836, 35.348079],
      },
    },
  ],
}

export default origin

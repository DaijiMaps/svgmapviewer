import { type LineGeoJSON } from 'svgmapviewer/geo'

export const viewbox: LineGeoJSON = {
  type: 'FeatureCollection',
  name: 'viewbox',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
  },
  features: [
    {
      type: 'Feature',
      properties: {
        direction: null,
        distance: null,
        ellipsoidal_distance: null,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [139.48836, 35.348079],
          [139.486917, 35.349357],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        direction: null,
        distance: null,
        ellipsoidal_distance: null,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [139.486917, 35.349357],
          [139.489804, 35.346891],
        ],
      },
    },
  ],
}

export default viewbox

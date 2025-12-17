import { type LineGeoJSON, type MeasureProperties } from 'svgmapviewer/geo'

export const measures: LineGeoJSON<MeasureProperties> = {
  type: 'FeatureCollection',
  name: 'measures',
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
        direction: 'x',
        distance: 0.001444,
        ellipsoidal_distance: 131.241284,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [139.48836, 35.348079],
          [139.489804, 35.348079],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        direction: 'y',
        distance: 0.001278,
        ellipsoidal_distance: 141.734729,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [139.48836, 35.348079],
          [139.48836, 35.346801],
        ],
      },
    },
  ],
}

export default measures

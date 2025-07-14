import { type MapMarkers } from '@daijimaps/svgmapviewer/carto'

// eslint-disable-next-line functional/functional-parameters
export const getMapMarkers: () => MapMarkers[] = () => [
  {
    name: 'all',
    /*
    pointsFilter: (f) =>
      !!f.properties.name?.match(/./) &&
      // exclude amenity/bus/information
      !f.properties.other_tags?.match(/"(amenity|bus|information)"/),
    */
  },
]

import { MapMarkers } from '@daijimaps/svgmapviewer/carto'
import './map.css'

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

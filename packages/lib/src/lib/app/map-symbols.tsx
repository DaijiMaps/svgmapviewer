import { MapSymbols } from '@daijimaps/svgmapviewer/carto'
import './map.css'

export const getMapSymbols: () => MapSymbols[] = () => [
  {
    name: 'toilets',
    href: '#XToilets',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"toilets"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    centroidsFilter: (f) =>
      (!!f.properties.other_tags?.match(/"toilets"/) ||
        f.properties.amenity === 'toilets') &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'parkings',
    href: '#XParking',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"parking"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    centroidsFilter: (f) =>
      !!f.properties.other_tags?.match(/"parking"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'drinking-fountains',
    href: '#XDrinkingFountain',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"amenity"=>"drinking_water"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'elevators',
    href: '#XElevator',
    pointsFilter: (f) =>
      !!f.properties.highway?.match(/elevator/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'escalators',
    href: '#XEscalator',
    midpointsFilter: (f) =>
      !!f.properties.highway?.match(/steps/) &&
      !!f.properties.other_tags?.match(/"conveying"=>"yes"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  /*
  {
    name: 'stairs',
    href: '#XStairs',
    midpointsFilter: (f) =>
      !!f.properties.highway?.match(/steps/) &&
      !f.properties.other_tags?.match(/"conveying"=>"yes"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  */
  {
    name: 'buses',
    href: '#XBus',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"bus"=>"yes"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'informations',
    href: '#XInformation',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"tourism"=>"information"/) &&
      !!f.properties.other_tags?.match(/"information"=>"office"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    centroidsFilter: (f) =>
      !!f.properties.other_tags?.match(/"tourist"=>"information"/) &&
      !!f.properties.other_tags?.match(/"information"=>"office"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
]

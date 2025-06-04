import type { MapSymbols } from '@daijimaps/svgmapviewer/carto'

// eslint-disable-next-line functional/functional-parameters
export const getMapSymbols: () => MapSymbols[] = () => [
  {
    name: 'toilets',
    href: '#XToilets',
    pointsFilter: (f) =>
      !!f.properties.other_tags?.match(/"toilets"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    polygonsFilter: (f) =>
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
    polygonsFilter: (f) =>
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
    linesFilter: (f) =>
      !!f.properties.highway?.match(/steps/) &&
      !!f.properties.other_tags?.match(/"conveying"=>"yes"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  /*
  {
    name: 'stairs',
    href: '#XStairs',
    linesFilter: (f) =>
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
    polygonsFilter: (f) =>
      !!f.properties.other_tags?.match(/"tourist"=>"information"/) &&
      !!f.properties.other_tags?.match(/"information"=>"office"/) &&
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
]

import type { MapSymbols } from '@daijimaps/svgmapviewer/carto'

// eslint-disable-next-line functional/functional-parameters
export const getMapSymbols: () => MapSymbols[] = () => [
  {
    name: 'toilets',
    href: '#XToilets',
    pointsFilter: (p) =>
      !!p.other_tags?.match(/"toilets"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    polygonsFilter: (p) =>
      (!!p.other_tags?.match(/"toilets"/) || p.amenity === 'toilets') &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'parkings',
    href: '#XParking',
    pointsFilter: (p) =>
      !!p.other_tags?.match(/"parking"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    polygonsFilter: (p) =>
      !!p.other_tags?.match(/"parking"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'drinking-fountains',
    href: '#XDrinkingFountain',
    pointsFilter: (p) =>
      !!p.other_tags?.match(/"amenity"=>"drinking_water"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'elevators',
    href: '#XElevator',
    pointsFilter: (p) =>
      !!p.highway?.match(/elevator/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'escalators',
    href: '#XEscalator',
    linesFilter: (p) =>
      !!p.highway?.match(/steps/) &&
      !!p.other_tags?.match(/"conveying"=>"yes"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  /*
  {
    name: 'stairs',
    href: '#XStairs',
    linesFilter: (p) =>
      !!p.highway?.match(/steps/) &&
      !p.other_tags?.match(/"conveying"=>"yes"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  */
  {
    name: 'buses',
    href: '#XBus',
    pointsFilter: (p) =>
      !!p.other_tags?.match(/"bus"=>"yes"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
  {
    name: 'informations',
    href: '#XInformation',
    pointsFilter: (p) =>
      !!p.other_tags?.match(/"tourism"=>"information"/) &&
      !!p.other_tags?.match(/"information"=>"office"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
    polygonsFilter: (p) =>
      !!p.other_tags?.match(/"tourist"=>"information"/) &&
      !!p.other_tags?.match(/"information"=>"office"/) &&
      !p.other_tags?.match(/"level"=>"[1-9][^"]*"/),
  },
]

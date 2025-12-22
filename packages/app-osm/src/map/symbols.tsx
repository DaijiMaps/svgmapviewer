import type { OsmMapSymbols } from 'svgmapviewer/carto'

// eslint-disable-next-line functional/functional-parameters
export const getMapSymbols: () => OsmMapSymbols[] = () => [
  {
    name: 'toilets',
    href: '#XToilets',
    pointsFilter: (p) => !!p.other_tags?.match(/"toilets"/),
    polygonsFilter: (p) =>
      p.building === 'toilets' ||
      p.amenity === 'toilets' ||
      !!p.other_tags?.match(/"toilets"/),
  },
  {
    name: 'parkings',
    href: '#XParking',
    pointsFilter: (p) => !!p.other_tags?.match(/"parking"/),
    polygonsFilter: (p) =>
      p.amenity === 'parking' || !!p.other_tags?.match(/"parking"/),
  },
  {
    name: 'drinking-fountains',
    href: '#XDrinkingFountain',
    pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"drinking_water"/),
  },
  {
    name: 'elevators',
    href: '#XElevator',
    pointsFilter: (p) => !!p.highway?.match(/elevator/),
  },
  {
    name: 'escalators',
    href: '#XEscalator',
    linesFilter: (p) =>
      !!p.highway?.match(/steps/) &&
      !!p.other_tags?.match(/"conveying"=>"yes"/),
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
    pointsFilter: (p) => !!p.other_tags?.match(/"bus"=>"yes"/),
  },
  {
    name: 'informations',
    href: '#XInformation',
    pointsFilter: (p) =>
      !!p.other_tags?.match(/"tourism"=>"information"/) &&
      !!p.other_tags?.match(/"information"=>"office"/),
    polygonsFilter: (p) =>
      !!p.other_tags?.match(/"tourist"=>"information"/) &&
      !!p.other_tags?.match(/"information"=>"office"/),
  },
]

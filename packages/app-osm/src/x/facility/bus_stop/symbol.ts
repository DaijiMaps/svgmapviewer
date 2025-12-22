import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const bus_stop: OsmMapSymbols = {
  name: 'buses',
  href: '#XBus',
  pointsFilter: (p) => !!p.other_tags?.match(/"bus"=>"yes"/),
}

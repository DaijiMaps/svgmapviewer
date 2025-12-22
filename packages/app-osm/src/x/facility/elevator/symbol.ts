import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const elevator: OsmMapSymbols = {
  name: 'elevators',
  href: '#Xelevator',
  pointsFilter: (p) => !!p.highway?.match(/elevator/),
}

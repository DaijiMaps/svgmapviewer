import type { OsmMapSymbols } from 'svgmapviewer/carto'

export const elevator: OsmMapSymbols = {
  name: 'elevators',
  href: '#XElevator',
  pointsFilter: (p) => !!p.highway?.match(/elevator/),
}

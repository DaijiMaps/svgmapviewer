import type { OsmMapSymbols } from 'svgmapviewer/carto'

import { facility } from '../x/facility/symbol'

// eslint-disable-next-line functional/functional-parameters
export const getMapSymbols: () => OsmMapSymbols[] = () => facility

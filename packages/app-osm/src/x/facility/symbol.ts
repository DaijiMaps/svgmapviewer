import type { OsmMapSymbols } from 'svgmapviewer/carto'
import { bus_stop } from './bus_stop/symbol'
import { elevator } from './elevator/symbol'
import { escalator } from './escalator/symbol'
import { information } from './information/symbol'
import { parking } from './parking/symbol'
//import { stairs } from './stairs/symbol'
import { toilet } from './toilet/symbol'
import { water } from './water/symbol'

export const facility: OsmMapSymbols[] = [
  bus_stop,
  elevator,
  escalator,
  information,
  parking,
  toilet,
  water,
]

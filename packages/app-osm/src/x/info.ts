import { type OsmSearchEntry } from 'svgmapviewer/geo'
import { bus_stop } from './facility/bus_stop/info'
import { elevator } from './facility/elevator/info'
import { escalator } from './facility/escalator/info'
import { information } from './facility/information/info'
import { toilet } from './facility/toilet/info'
import { water } from './facility/water/info'
import { shop } from './shop/info'

export const osmSearchEntries: OsmSearchEntry[] = [
  bus_stop,
  elevator,
  escalator,
  information,
  shop,
  toilet,
  water,
]

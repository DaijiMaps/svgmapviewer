import { Bus } from './Bus'
import { DrinkingFountain } from './DrinkingFountain'
import { Elevator } from './Elevator'
import { Escalator } from './Escalator'
import { Information } from './Information'
import { Parking } from './Parking'
import { Stairs } from './Stairs'
import { Toilets } from './Toilets'

// XXX POI kind
type Kind =
  | 'bus'
  | 'elevator'
  | 'escalator'
  | 'information'
  | 'parking'
  | 'stairs'
  | 'toilets'
  | 'water'

const names: Record<Kind, string> = {
  bus: '#XBus',
  elevator: '#XElevator',
  escalator: '#XEscalator',
  information: '#XInformation',
  parking: '#XParking',
  stairs: '#XStairs',
  toilets: '#XToilets',
  water: '#XDrinkingFountain',
}

const nameMap: Map<string, string> = new Map(Object.entries(names))

export {
  Bus,
  DrinkingFountain,
  Elevator,
  Escalator,
  Information,
  Parking,
  Stairs,
  Toilets,
}

export {
  nameMap as symbolNameMap,
  names as symbolNames,
  type Kind as SymbolKind,
}

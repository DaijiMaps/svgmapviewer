import { Bus } from './Bus'
import { DrinkingFountain } from './DrinkingFountain'
import { Elevator } from './Elevator'
import { Escalator } from './Escalator'
import { Information } from './Information'
import { Parking } from './Parking'
import { Stairs } from './Stairs'
import { Toilets } from './Toilets'

// XXX POI kind
export type Kind =
  | 'bus'
  | 'elevator'
  | 'escalator'
  | 'information'
  | 'parking'
  | 'stairs'
  | 'toilets'
  | 'water'

export const names: Record<Kind, string> = {
  bus: '#XBus',
  elevator: '#XElevator',
  escalator: '#XEscalator',
  information: '#XInformation',
  parking: '#XParking',
  stairs: '#XStairs',
  toilets: '#XToilets',
  water: '#XDrinkingFountain',
}

export {
  Bus,
  DrinkingFountain,
  Elevator,
  Escalator,
  Information,
  Parking,
  Stairs,
  names as symbolNames,
  Toilets,
  type Kind as SymbolKind,
}

import type { ReactNode } from 'react'
import { Bus } from './Bus'
import { DrinkingFountain } from './DrinkingFountain'
import { Elevator } from './Elevator'
import { Escalator } from './Escalator'
import { EscalatorDown } from './EscalatorDown'
import { EscalatorUp } from './EscalatorUp'
import { Information } from './Information'
import { Locker } from './Locker'
import { Parking } from './Parking'
import { Smoking } from './Smoking'
import { Stairs } from './Stairs'
import { StairsDown } from './StairsDown'
import { StairsUp } from './StairsUp'
import { Toilets } from './Toilets'
import { ToiletsMen } from './ToiletsMen'
import { ToiletsWomen } from './ToiletsWomen'
import { WheelChair } from './WheelChair'

// XXX POI kind
type Kind =
  | 'bus'
  | 'elevator'
  | 'escalator'
  | 'escalator-down'
  | 'escalator-up'
  | 'information'
  | 'locker'
  | 'parking'
  | 'smoking'
  | 'stairs'
  | 'stairs-down'
  | 'stairs-up'
  | 'toilets'
  | 'toilets-men'
  | 'toilets-women'
  | 'water'
  | 'wheelchair'

const names: Record<Kind, string> = {
  bus: '#XBus',
  elevator: '#XElevator',
  escalator: '#XEscalator',
  'escalator-down': '#XEscalatorDown',
  'escalator-up': '#XEscalatorUp',
  information: '#XInformation',
  locker: '#XLocker',
  parking: '#XParking',
  smoking: '#XSmoking',
  stairs: '#XStairs',
  'stairs-down': '#XStairsDown',
  'stairs-up': '#XStairsUp',
  toilets: '#XToilets',
  'toilets-men': '#XToiletsMen',
  'toilets-women': '#XToiletsWomen',
  water: '#XDrinkingFountain',
  wheelchair: '#XWheelChair',
}

const nameMap: Map<string, string> = new Map(Object.entries(names))

type RenderSymbol = () => ReactNode

const renderMap: Record<Kind, RenderSymbol> = {
  bus: Bus,
  elevator: Elevator,
  escalator: Escalator,
  'escalator-down': EscalatorDown,
  'escalator-up': EscalatorUp,
  information: Information,
  locker: Locker,
  parking: Parking,
  smoking: Smoking,
  stairs: Stairs,
  'stairs-down': StairsDown,
  'stairs-up': StairsUp,
  toilets: Toilets,
  'toilets-men': ToiletsMen,
  'toilets-women': ToiletsWomen,
  water: DrinkingFountain,
  wheelchair: WheelChair,
}

export {
  nameMap as symbolNameMap,
  names as symbolNames,
  renderMap as symbolRenderMap,
  type Kind as SymbolKind,
}

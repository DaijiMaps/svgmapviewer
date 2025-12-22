import type { ReactNode } from 'react'
import { Bus } from './bus/render'
import { Elevator } from './elevator/render'
import { EscalatorDown } from './escalator_down/render'
import { EscalatorUp } from './escalator_up/render'
import { Escalator } from './escalator/render'
import { Information } from './information/render'
import { Locker } from './locker/render'
import { Parking } from './parking/render'
import { Smoking } from './smoking/render'
import { StairsDown } from './stairs_down/render'
import { StairsUp } from './stairs_up/render'
import { Stairs } from './stairs/render'
import { ToiletsMen } from './toilets_men/render'
import { ToiletsWomen } from './toilets_women/render'
import { Toilets } from './toilets/render'
import { DrinkingFountain } from './water/render'
import { WheelChair } from './wheelchair/render'

// XXX POI kind
export type Kind =
  | 'bus'
  | 'elevator'
  | 'escalator'
  | 'escalator_down'
  | 'escalator_up'
  | 'information'
  | 'locker'
  | 'parking'
  | 'smoking'
  | 'stairs'
  | 'stairs_down'
  | 'stairs_up'
  | 'toilets'
  | 'toilets_men'
  | 'toilets_women'
  | 'water'
  | 'wheelchair'

const names: Record<Kind, string> = {
  bus: '#Xbus',
  elevator: '#Xelevator',
  escalator: '#Xescalator',
  escalator_down: '#Xescalator_down',
  escalator_up: '#Xescalator_up',
  information: '#Xinformation',
  locker: '#Xlocker',
  parking: '#Xparking',
  smoking: '#Xsmoking',
  stairs: '#Xstairs',
  stairs_down: '#Xstairs_down',
  stairs_up: '#Xstairs_up',
  toilets: '#Xtoilets',
  toilets_men: '#Xtoilets_men',
  toilets_women: '#Xtoilets_women',
  water: '#Xwater',
  wheelchair: '#Xwheelchair',
}

const nameMap: Map<string, string> = new Map(Object.entries(names))

export type RenderSymbol = (props: Readonly<{ id: Kind }>) => ReactNode

const renderMap: Record<Kind, RenderSymbol> = {
  bus: Bus,
  elevator: Elevator,
  escalator: Escalator,
  escalator_down: EscalatorDown,
  escalator_up: EscalatorUp,
  information: Information,
  locker: Locker,
  parking: Parking,
  smoking: Smoking,
  stairs: Stairs,
  stairs_down: StairsDown,
  stairs_up: StairsUp,
  toilets: Toilets,
  toilets_men: ToiletsMen,
  toilets_women: ToiletsWomen,
  water: DrinkingFountain,
  wheelchair: WheelChair,
}

export {
  nameMap as symbolNameMap,
  names as symbolNames,
  renderMap as symbolRenderMap,
  type Kind as SymbolKind,
}

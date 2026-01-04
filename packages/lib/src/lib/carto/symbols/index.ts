import type { ReactNode } from 'react'

import { Bus } from './bus/render'
import { Elevator } from './elevator/render'
import { Escalator } from './escalator/render'
import { EscalatorDown } from './escalator_down/render'
import { EscalatorUp } from './escalator_up/render'
import { Information } from './information/render'
import { Locker } from './locker/render'
import { Parking } from './parking/render'
import { Smoking } from './smoking/render'
import { Stairs } from './stairs/render'
import { StairsDown } from './stairs_down/render'
import { StairsUp } from './stairs_up/render'
import { Toilets } from './toilets/render'
import { ToiletsMen } from './toilets_men/render'
import { ToiletsWomen } from './toilets_women/render'
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

export { renderMap as symbolRenderMap, type Kind as SymbolKind }

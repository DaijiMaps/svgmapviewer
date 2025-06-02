import { benchPath } from './bench'
import { entrancePath } from './entrance'
import { guidePostPath } from './guide-post'
import { infoBoardPath } from './info-board'
import { monumentPath } from './monument'
import { statuePath } from './statue'
import { toriiPath } from './torii'
import {
  tree16x16Path,
  tree2x4Path,
  tree4x8Path,
  tree8x16Path,
  tree8x8Path,
} from './tree'
import { vendingMachinePath } from './vendingMachine'
import { wasteBasketPath } from './wasteBasket'

// XXX POI kind
export type Kind =
  | 'bench'
  | 'entrance'
  | 'guide_post'
  | 'info_board'
  | 'monument'
  | 'statue'
  | 'torii'
  | 'tree'
  | 'vending_machine'
  | 'waste_basket'

export const names: Record<Kind, string> = {
  bench: benchPath,
  entrance: entrancePath,
  guide_post: guidePostPath,
  info_board: infoBoardPath,
  monument: monumentPath,
  statue: statuePath,
  torii: toriiPath,
  tree: tree4x8Path,
  vending_machine: vendingMachinePath,
  waste_basket: wasteBasketPath,
}

export {
  benchPath,
  entrancePath,
  guidePostPath,
  infoBoardPath,
  monumentPath,
  names as objectNames,
  statuePath,
  toriiPath,
  tree16x16Path,
  tree2x4Path,
  tree4x8Path,
  tree8x16Path,
  tree8x8Path,
  vendingMachinePath,
  wasteBasketPath,
  type Kind as ObjectKind,
}

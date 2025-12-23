import { d as benchPath } from './bench/d'
import { d as entrancePath } from './entrance/d'
import { d as guidePostPath } from './guide_post/d'
import { d as infoBoardPath } from './info_board/d'
import { d as monumentPath } from './monument/d'
import { d as statuePath } from './statue/d'
import { d as toriiPath } from './torii/d'
import { d as tree2x4Path } from './tree_2x4/d'
import { d as tree4x8Path } from './tree_4x8/d'
import { d as tree8x8Path } from './tree_8x8/d'
import { d as tree8x16Path } from './tree_8x16/d'
import { d as tree16x16Path } from './tree_16x16/d'
import { d as vendingMachinePath } from './vending_machine/d'
import { d as wasteBasketPath } from './waste_basket/d'

// XXX POI kind
type Kind =
  | 'bench'
  | 'entrance'
  | 'guide_post'
  | 'info_board'
  | 'monument'
  | 'statue'
  | 'torii'
  | 'tree_2x4'
  | 'tree_4x8'
  | 'tree_8x8'
  | 'tree_8x16'
  | 'tree_16x16'
  | 'vending_machine'
  | 'waste_basket'

const names: Record<Kind, string> = {
  bench: benchPath,
  entrance: entrancePath,
  guide_post: guidePostPath,
  info_board: infoBoardPath,
  monument: monumentPath,
  statue: statuePath,
  torii: toriiPath,
  tree_2x4: tree2x4Path,
  tree_4x8: tree4x8Path,
  tree_8x8: tree8x8Path,
  tree_8x16: tree8x16Path,
  tree_16x16: tree16x16Path,
  vending_machine: vendingMachinePath,
  waste_basket: wasteBasketPath,
}

const nameMap: Map<string, string> = new Map(Object.entries(names))

/*
export {
  benchPath,
  entrancePath,
  guidePostPath,
  infoBoardPath,
  monumentPath,
  statuePath,
  toriiPath,
  tree16x16Path,
  tree2x4Path,
  tree4x8Path,
  tree8x16Path,
  tree8x8Path,
  vendingMachinePath,
  wasteBasketPath,
}
*/

export {
  nameMap as objectNameMap,
  names as objectNames,
  type Kind as ObjectKind,
}

/* eslint-disable functional/functional-parameters */
import type { OsmMapObjects } from 'svgmapviewer/carto'
import { bench } from '../x/object/bench/object'
import { entrance } from '../x/object/entrance/object'
import { guidepost } from '../x/object/guidepost/object'
import { info_board } from '../x/object/info-board/object'
import { monument } from '../x/object/monument/object'
import { status } from '../x/object/statue/object'
import { torii } from '../x/object/torii/object'
import { tree1 } from '../x/object/tree1/object'
import { vending_machine } from '../x/object/vending_machine/object'
import { waste_basket } from '../x/object/waste_basket/object'

export const getMapObjects: () => OsmMapObjects[] = () => [
  bench,
  entrance,
  guidepost,
  info_board,
  monument,
  status,
  torii,
  tree1,
  vending_machine,
  waste_basket,
]

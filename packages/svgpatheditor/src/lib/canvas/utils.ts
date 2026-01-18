import type { VecVec } from 'svgmapviewer/vec'

import { boxBox, type BoxBox } from 'svgmapviewer/box'

export function sizeToViewBox(size: VecVec): BoxBox {
  return boxBox(-size.x / 2, -size.y / 2, size.x, size.y)
}

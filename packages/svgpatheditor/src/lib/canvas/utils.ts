import { boxBox, type BoxBox } from 'svgmapviewer/box'
import type { VecVec } from 'svgmapviewer/vec'

export function sizeToViewBox(size: VecVec): BoxBox {
  return boxBox(-size.x / 2, -size.y / 2, size.x, size.y)
}

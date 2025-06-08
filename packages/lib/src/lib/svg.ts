/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type BoxBox } from './box/prefixed'
import { queryShadowRoot } from './dom'
import { trunc2 } from './utils'

export function syncViewBox(
  id: string,
  id2: string,
  viewBox: Readonly<BoxBox>
): void {
  const e: null | Element = queryShadowRoot(id, id2)
  if (e === null || !(e instanceof SVGSVGElement)) {
    return
  }
  const svg: SVGSVGElement = e
  svg.viewBox.baseVal.x = trunc2(viewBox.x)
  svg.viewBox.baseVal.y = trunc2(viewBox.y)
  svg.viewBox.baseVal.width = trunc2(viewBox.width)
  svg.viewBox.baseVal.height = trunc2(viewBox.height)
}

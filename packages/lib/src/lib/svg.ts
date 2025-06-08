/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type BoxBox } from './box/prefixed'
import { trunc2 } from './utils'

export function syncViewBox(
  id: string,
  id2: string,
  viewBox: Readonly<BoxBox>
): void {
  const svg: null | SVGSVGElement =
    document.querySelector(id)?.shadowRoot?.querySelector(id2) ?? null
  if (svg === null) {
    return
  }
  svg.viewBox.baseVal.x = trunc2(viewBox.x)
  svg.viewBox.baseVal.y = trunc2(viewBox.y)
  svg.viewBox.baseVal.width = trunc2(viewBox.width)
  svg.viewBox.baseVal.height = trunc2(viewBox.height)
}

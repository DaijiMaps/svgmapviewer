/* eslint-disable functional/no-return-void */
import { type BoxBox } from './box/prefixed'

export function syncViewBox(
  id: string,
  id2: string,
  viewBox: Readonly<BoxBox>
): void {
  const svg: undefined | null | SVGSVGElement = document
    .querySelector(id)
    ?.shadowRoot?.querySelector(id2)
  if (svg === undefined || svg === null) {
    return
  }
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.x = truncate(viewBox.x)
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.y = truncate(viewBox.y)
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.width = truncate(viewBox.width)
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.height = truncate(viewBox.height)
}

function truncate(n: number): number {
  return Math.round(n * 100) / 100
}

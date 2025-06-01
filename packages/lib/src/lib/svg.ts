import { type BoxBox } from './box/prefixed'

// eslint-disable-next-line functional/no-return-void
export function syncViewBox(id: string, viewBox: Readonly<BoxBox>): void {
  const svg: null | SVGSVGElement = document.querySelector(`${id}`)
  if (svg === null) {
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

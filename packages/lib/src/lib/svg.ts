import { BoxBox } from './box/prefixed'

// eslint-disable-next-line functional/no-return-void
export function syncViewBox(id: string, viewBox: Readonly<BoxBox>): void {
  const svg: null | SVGSVGElement = document.querySelector(`${id}`)
  if (svg === null) {
    return
  }
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.x = viewBox.x
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.y = viewBox.y
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.width = viewBox.width
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  svg.viewBox.baseVal.height = viewBox.height
}

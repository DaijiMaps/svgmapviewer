/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
export function tag(
  e: Readonly<HTMLElement | SVGElement>,
  name: string,
  adding: boolean
): void {
  e.classList.add(adding ? name : `not-${name}`)
  e.classList.remove(adding ? `not-${name}` : name)
}

export function tag2(
  e: Readonly<HTMLElement | SVGElement>,
  p: string,
  q: string,
  adding: boolean
): void {
  e.classList.add(adding ? p : q)
  e.classList.remove(adding ? q : p)
}

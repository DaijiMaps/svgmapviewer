/* eslint-disable functional/no-throw-statements */
import type { DistanceRadius } from './distance-types'
import type { Layout } from './layout-types'

export function findRadius({
  container,
  svgScale,
}: Readonly<Layout>): DistanceRadius {
  const l = (Math.max(container.width, container.height) / 2) * svgScale.s
  const c = Math.round(Math.log10(l))
  // 12345 -> 12.345
  // ll >= 10 && ll < 100
  const ll = l / Math.pow(10, c - 1)
  const ns = findDiv(ll)
  if (ns.length < 1) {
    throw new Error('findDiv')
  }
  const { u } = ns[0]
  const svg = u * Math.pow(10, c - 1)
  return {
    svg,
    client: svg / svgScale.s,
  }
}

export function findDiv(ll: number): { u: number; n: number }[] {
  const ns = UNITS.flatMap((u) => {
    const n = Math.floor(ll / u)
    return n < 3 || n >= 10 ? [] : [{ u, n }]
  })
  return ns
}

const UNITS = [1, 2, 2.5, 5, 10, 15, 20, 25, 30, 40, 50]

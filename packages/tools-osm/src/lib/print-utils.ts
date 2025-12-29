import { Array, Order, pipe } from 'effect'

function uncomma(s: string): string[] {
  return Array.fromIterable(s.split(/,/)).map((ss) => ss.trim())
}

function splitTypes1(t: string): string[] {
  const re = /<([^<>]*)>/g
  if (t.match(re)) {
    const all = t.matchAll(re)
    const aaa = Array.fromIterable(all).map((m) => uncomma(m[1]))
    const rest = t.replaceAll(re, '')
    const bbb = splitTypes(rest)
    return aaa.concat(bbb).flat()
  } else {
    return uncomma(t)
  }
}

export function splitTypes(t: string): string[] {
  return pipe(t, splitTypes1, Array.sort(Order.string))
}

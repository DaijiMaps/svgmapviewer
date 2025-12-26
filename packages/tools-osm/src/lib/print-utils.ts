import { Order } from 'effect'

function uncomma(s: string): readonly string[] {
  return s.split(/,/).map((ss) => ss.trim())
}

function splitTypes1(t: string): readonly string[] {
  const re = /<([^<>]*)>/g
  if (t.match(re)) {
    const all = t.matchAll(re)
    const aaa = Array.from(all).map((m) => uncomma(m[1]))
    const rest = t.replaceAll(re, '')
    const bbb = splitTypes(rest)
    return [...aaa, ...bbb].flat()
  } else {
    return uncomma(t)
  }
}

export function splitTypes(t: string): readonly string[] {
  return splitTypes1(t).toSorted(Order.string)
}

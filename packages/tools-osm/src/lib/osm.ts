import { Array, Record } from 'effect'
import type { _Properties, _Value } from './geojson/geojson-types'

function expandVal(s: string): _Value {
  return s === 'null' ? null : !isNaN(Number(s)) ? Number(s) : s
}

export function splitOtherTags(s: string): _Properties {
  const kvs = s
    .split(/"=>"/g)
    .flatMap((s) => s.replace(/^"/, '').replace(/"$/, '').split(/","/))
  const range = Array.range(0, kvs.length / 2 - 1)
  const pairs = range
    .map((i) => [kvs[i * 2], kvs[i * 2 + 1]] as [string, string])
    .map(([k, v]) => [k, expandVal(v)] as [string, _Value])
  return Record.fromEntries(pairs)
}

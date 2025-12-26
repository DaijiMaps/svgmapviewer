import { Array, Record } from 'effect'
import type { _Properties } from './geojson-types'

export function splitOtherTags(s: string): _Properties {
  const kvs = s
    .split(/"=>"/g)
    .flatMap((s) => s.replace(/^"/, '').replace(/"$/, '').split(/","/))
  const range = Array.range(0, kvs.length / 2 - 1)
  const pairs = range.map(
    (i) => [kvs[i * 2], kvs[i * 2 + 1]] as [string, string]
  )
  return Record.fromEntries(pairs)
}

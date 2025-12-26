import { expect, test } from '@rstest/core'
import { splitOtherTags } from './osm'

test('split other_tags', () => {
  const v = `"a"=>"a","b"=>"b"`
  const x = {
    a: 'a',
    b: 'b',
  }

  const p = splitOtherTags(v)

  expect(p).toEqual(x)
})

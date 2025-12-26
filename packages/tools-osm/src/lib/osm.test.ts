import { expect, test } from '@rstest/core'
import { splitOtherTags } from './osm'

test('split other_tags', () => {
  const v = `"a"=>"a","b"=>"1","c"=>"1.23","d"=>"null"`
  const x = {
    a: 'a',
    b: 1,
    c: 1.23,
    d: null,
  }

  const p = splitOtherTags(v)

  expect(p).toEqual(x)
})

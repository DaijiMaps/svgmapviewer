//import { type Readonly } from 'type-fest/source/readonly-deep'
import { expect, test } from '@rstest/core'
import { type ImmutableShallow } from '../../src/lib/utils'

export type A = Readonly<{ a: { a: { a: number } } }>

test('Readonly', () => {
  const a1: A = { a: { a: { a: 0 } } }
  const a2: A = { a: { a: { a: 0 } } }

  expect(a1).toStrictEqual(a2)
})

type ReallyReadonlyArray<T> = ImmutableShallow<ReadonlyArray<T>>

type T = ReallyReadonlyArray<number>

test('ReadonlyArray', () => {
  const t1: T = [1, 2]
  const t2: T = [1, 2]

  expect(t1).toStrictEqual(t2)
})

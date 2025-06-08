//// zoomToScale

import { type BoxBox } from './box/prefixed'

//// isUndefined
//// isNotUndefined
//// isDefined
//// isNotDefined
//// isNull
//// isNotNull
//// isUndefinedOrNull
//// ifUndefinedOr
//// ifNullOr
//// ifUndefinedOrNullOr

type U = undefined
const U = undefined

type N = null
const N = null

export const isUndefined = <A>(a: U | A): a is U => a === U
export const isNotUndefined = <A>(a: U | A): a is A => a !== U
export const isDefined = <A>(a: U | A): a is A => !isUndefined(a)
export const isNotDefined = <A>(a: U | A): a is U => !isNotUndefined(a)

export const isNull = <A>(a: N | A): a is N => a === N
export const isNotNull = <A>(a: N | A): a is A => a !== N

export const isUndefinedOrNull = <A>(a: U | N | A): a is U | N =>
  isUndefined(a) || isNull(a)

export const ifUndefinedOr = <A>(a: U | A, b: A): A =>
  isNotUndefined(a) ? a : b
export const ifNullOr = <A>(a: N | A, b: A): A => (isNotNull(a) ? a : b)
export const ifUndefinedOrNullOr = <A>(a: U | N | A, b: A): A =>
  !isUndefinedOrNull(a) ? a : b

// https://www.npmjs.com/package/is-immutable-type

export type ImmutableShallow<T extends object> = {
  readonly [P in keyof T & {}]: T[P]
}

////

// eslint-disable-next-line functional/functional-parameters
export function getBodySize(): BoxBox {
  return {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  }
}

////

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (...args: readonly unknown[]) => unknown
    ? T[P]
    : T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P]
}

////

export function trunc2(n: number): number {
  return Math.round(n * 100) / 100
}

export function trunc7(n: number): number {
  return Math.round(n * 10000000) / 10000000
}

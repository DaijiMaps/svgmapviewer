import { Array, Number, Option, pipe, Result, type Order } from 'effect'
import { type Touch } from 'react'

import type { Dir } from '../../../types'
//import { type ReadonlyDeep } from 'type-fest'
import { isUndefined } from '../../utils'
import {
  vecAngle,
  vecDist,
  vecMidpoint,
  type VecVec as Vec,
} from '../../vec/prefixed'

export type VecsEntry = Readonly<[number, readonly Vec[]]>
export type VecsEntries = Readonly<readonly VecsEntry[]>
export type Vecs = ReadonlyMap<number, readonly Vec[]>

export type Touches = Readonly<{
  vecs: Vecs
  points: readonly Vec[]
  cursor: null | Vec
  dists: readonly number[]
  z: null | Dir
  horizontal: null | boolean
}>

const vecOrder: Order.Order<Vec> = (a, b) =>
  Number.Order(a.x, b.x) || Number.Order(a.y, b.y)

function vecsOrderAt(
  a: readonly Vec[],
  b: readonly Vec[],
  i: number
): 0 | 1 | -1 {
  const n = Math.min(a.length, b.length)
  const av = a[i]
  const bv = b[i]
  if (i >= n || isUndefined(av) || isUndefined(bv)) {
    return Number.Order(a.length, b.length)
  }
  const o = vecOrder(av, bv)
  return o === 0 ? vecsOrderAt(a, b, i + 1) : o
}

const vecsOrder: Order.Order<readonly Vec[]> = (a, b) => vecsOrderAt(a, b, 0)

function concatVecs(a: Vecs, b: Vecs): Vecs {
  return pipe(
    [...a.entries(), ...b.entries()],
    Array.reduce(new Map<number, readonly Vec[]>(), (acc, [id, vs]) => {
      const prev = Option.fromUndefinedOr(acc.get(id))
      const next = Option.isSome(prev) ? [...prev.value, ...vs] : vs
      return new Map(acc).set(id, next)
    })
  )
}

function calcZoom([d0, d1, d2, d3]: Readonly<readonly number[]>): null | Dir {
  return isUndefined(d0) ||
    isUndefined(d1) ||
    isUndefined(d2) ||
    isUndefined(d3)
    ? null
    : d0 < d1 && d1 < d2 && d2 < d3 // zoom-in
      ? -1
      : d0 > d1 && d1 > d2 && d2 > d3 // zoom-out
        ? 1
        : null
}

function updateDists(
  dists: Readonly<readonly number[]>,
  d: number,
  limit: number
): Readonly<readonly number[]> {
  const prev = dists.length > 0 ? dists[0] : d
  const l = Math.pow(prev - d, 2)
  return dists.length === 0 || l > limit / 10 ? [d, ...dists] : dists
}

export function vecsToPoints(vecs: Vecs): Readonly<readonly Vec[]> {
  return pipe(
    vecs.values(),
    Array.fromIterable,
    Array.sort(vecsOrder),
    Array.filterMap((vs) =>
      vs.length === 0 ? Result.failVoid : Result.succeed(vs[0])
    )
  )
}

function pointsToCursor(points: Readonly<readonly Vec[]>): null | Vec {
  return points.length < 2 ? null : vecMidpoint(points)
}

function changesToEntries(
  ev: Readonly<TouchEvent | React.TouchEvent>
): VecsEntries {
  return pipe(
    ev.changedTouches,
    (touches) => Array.Array.from<Touch>(touches),
    Array.map((t: Readonly<Touch>): [number, readonly Vec[]] => [
      t.identifier,
      [{ x: t.clientX, y: t.clientY }],
    ])
  )
}

function changesToVecs(ev: Readonly<TouchEvent | React.TouchEvent>): Vecs {
  return new Map(changesToEntries(ev))
}

export function handleTouchStart(
  touches: Touches,
  ev: Readonly<TouchEvent | React.TouchEvent>
): Touches {
  const vecs = concatVecs(touches.vecs, changesToVecs(ev))
  const points = vecsToPoints(vecs)
  const cursor = pointsToCursor(points)

  const horizontal =
    points.length !== 2 ? null : Math.abs(vecAngle(points[0], points[1])) < 0.5

  return { ...touches, vecs, points, cursor, horizontal }
}

export function handleTouchMove(
  touches: Touches,
  ev: Readonly<TouchEvent | React.TouchEvent>,
  limit: number
): Touches {
  const changes = changesToVecs(ev)
  const vecs: Vecs = new Map(
    pipe(
      touches.vecs.entries(),
      Array.fromIterable,
      Array.map(([id, ovs]) => [
        id,
        ((vs) => (Option.isSome(vs) ? [...vs.value, ...ovs] : ovs))(
          Option.fromUndefinedOr(changes.get(id))
        ),
      ])
    )
  )
  const points = vecsToPoints(vecs)
  const cursor = pointsToCursor(points)
  const [p, q] = points
  if (cursor === null || isUndefined(p) || isUndefined(q)) {
    return { ...touches, vecs, points, cursor }
  }
  const dists = updateDists(touches.dists, vecDist(p, q), limit)
  const z = calcZoom(dists)
  return {
    vecs,
    points,
    cursor,
    dists,
    z,
    horizontal: touches.horizontal,
  }
}

export function handleTouchEnd(
  touches: Touches,
  ev: Readonly<TouchEvent | React.TouchEvent>
): Touches {
  const changes = changesToVecs(ev)
  const vecs: Vecs = new Map(
    pipe(
      touches.vecs.entries(),
      Array.fromIterable,
      Array.filterMap(([k, v]) =>
        // IDs in TouchEnd changedTouches => disappearing IDs
        changes.has(k) ? Result.failVoid : Result.succeed([k, v] as const)
      )
    )
  )
  const points = vecsToPoints(vecs)
  const cursor = pointsToCursor(points)
  return {
    vecs,
    points,
    cursor,
    dists: vecs.size === 0 ? [] : touches.dists,
    z: vecs.size === 0 ? null : touches.z,
    horizontal: touches.horizontal,
  }
}

// eslint-disable-next-line functional/functional-parameters
export function resetTouches(): Touches {
  return {
    vecs: new Map(),
    points: [],
    cursor: null,
    dists: [],
    z: null,
    horizontal: null,
  }
}

export function discardTouches(touches: Touches): Touches {
  const vecs: Vecs = new Map(
    pipe(
      touches.vecs.entries(),
      Array.fromIterable,
      Array.map(([id, ovs]) => [
        id,
        ((v) => (Option.isSome(v) ? [v.value] : []))(
          Option.fromUndefinedOr(ovs[0])
        ),
      ])
    )
  )
  return { ...touches, vecs, dists: [], z: null }
}

export function isMultiTouch(touches: Touches): boolean {
  return touches.vecs.size >= 2
}

export function isMultiTouchEnding(touches: Touches): boolean {
  return touches.vecs.size === 0
}

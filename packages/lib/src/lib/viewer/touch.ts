import {
  number as Number,
  option as Option,
  readonlyArray as ReadonlyArray,
  readonlyMap as ReadonlyMap,
} from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { type Touch } from 'react'
//import { type ReadonlyDeep } from 'type-fest'
import { isUndefined } from '../utils'
import {
  type VecVec as Vec,
  vecAngle,
  vecDist,
  vecMidpoint,
  vecOrd,
} from '../vec/prefixed'

const vecsOrd = ReadonlyArray.getOrd<Vec>(vecOrd)

const vecsWitherable = ReadonlyMap.getWitherable(Number.Ord)
const vecsFilterableWithIndex = ReadonlyMap.getFilterableWithIndex<number>()
const vecsMonoid = ReadonlyMap.getMonoid(
  Number.Eq,
  ReadonlyArray.getSemigroup<Vec>()
)

export type VecsEntry = Readonly<[number, readonly Vec[]]>
export type VecsEntries = Readonly<readonly VecsEntry[]>
export type Vecs = ReadonlyMap<number, readonly Vec[]>

export type Touches = Readonly<{
  vecs: Vecs
  points: readonly Vec[]
  cursor: null | Vec
  dists: readonly number[]
  z: null | number
  horizontal: null | boolean
}>

function calcZoom([d0, d1, d2, d3]: Readonly<readonly number[]>):
  | null
  | number {
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
    vecs,
    ReadonlyMap.values(vecsOrd),
    ReadonlyArray.filterMap((vs) =>
      vs.length === 0 ? Option.none : Option.some(vs[0])
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
    Array.from,
    ReadonlyArray.map<Touch, [number, readonly Vec[]]>((t) => [
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
  const vecs: Vecs = vecsMonoid.concat(touches.vecs, changesToVecs(ev))
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
  const vecs = vecsWitherable.mapWithIndex(touches.vecs, (id, ovs) =>
    pipe(
      changes.get(id),
      Option.fromNullable,
      Option.fold(() => ovs, ReadonlyArray.concat(ovs))
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
  const vecs: Vecs = vecsFilterableWithIndex.filterMapWithIndex(
    touches.vecs,
    (k: number, v: Readonly<Vec[]>) =>
      // IDs in TouchEnd changedTouches => disappearing IDs
      changes.has(k) ? Option.none : Option.some(v)
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
  const vecs = ReadonlyMap.map<Readonly<Vec[]>, Readonly<Vec[]>>((ovs) =>
    pipe(
      ovs[0],
      Option.fromNullable,
      Option.fold(
        () => [],
        (v) => [v]
      )
    )
  )(touches.vecs)
  return { ...touches, vecs, dists: [], z: null }
}

export function isMultiTouch(touches: Touches): boolean {
  return touches.vecs.size >= 2
}

export function isMultiTouchEnding(touches: Touches): boolean {
  return touches.vecs.size === 0
}

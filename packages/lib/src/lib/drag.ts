import { ReadonlyDeep } from 'type-fest'
import { BoxBox as Box, boxCenter } from './box/prefixed'
import { VecVec as Vec, vecAdd, vecCopy, vecSub } from './vec/prefixed'

export type Drag = ReadonlyDeep<{
  cursor: Vec
  start: Vec
  move: Vec
}>

export const dragStart = (scroll: Box, cursor: Vec): Drag => {
  return {
    cursor: vecCopy(cursor),
    start: vecCopy(scroll),
    move: vecCopy(scroll),
  }
}

export const dragMove = (drag: Drag, p: Vec): Drag => {
  const o = drag.cursor
  const d = vecSub(p, o)

  return {
    ...drag,
    move: vecAdd(drag.start, d),
  }
}

// XXX practically this is not needed if dragStart() is always called
// XXX mainly for test (see "recenter 3")
export const dragReset = (scroll: Box): Drag => {
  return {
    cursor: boxCenter(scroll),
    start: vecCopy(scroll),
    move: vecCopy(scroll),
  }
}

import { Bench } from './objects/bench'
import { GuidePost } from './objects/guide-post'
import { InfoBoard } from './objects/info-board'
import { Tree16x16, Tree2x4, Tree4x8, Tree8x16, Tree8x8 } from './objects/tree'
import { Parking } from './symbols/Parking'
import { Toilets } from './symbols/Toilets'

export function Assets() {
  return (
    <g className="assets">
      <Symbols />
      <Objects />
    </g>
  )
}

export function Symbols() {
  return (
    <g className="symbols">
      <Parking />
      <Toilets />
    </g>
  )
}

function Objects() {
  return (
    <g className="objects">
      <Bench />
      <GuidePost />
      <InfoBoard />
      <Tree2x4 />
      <Tree4x8 />
      <Tree8x8 />
      <Tree8x16 />
      <Tree16x16 />
    </g>
  )
}

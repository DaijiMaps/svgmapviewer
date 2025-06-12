/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Measure, MeasureCoordinate, MeasureDistance } from './Measure'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from './lib/css'

export function Guides(): ReactNode {
  return (
    <div className="guides">
      <svg className="guides">
        <Measure />
      </svg>
      <MeasureDistance />
      <MeasureCoordinate />
      <style>{style}</style>
    </div>
  )
}

const style = `
.guides {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  pointer-events: none;
  z-index: 2;
}

.distance > text,
.coordinate > text {
  user-select: none;
  -webkit-user-select: none;
}
`

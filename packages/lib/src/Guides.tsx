/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Measure, MeasureCoordinate, MeasureDistance } from './Measure'

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
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  height: 100svh;
  pointer-events: none;
  z-index: 2;
}

.distance > text,
.coordinate > text {
  user-select: none;
  -webkit-user-select: none;
}
`

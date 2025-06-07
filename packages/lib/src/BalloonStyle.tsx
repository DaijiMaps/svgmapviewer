/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function BalloonCss(): ReactNode {
  return (
    <style>
      {`
.balloon-container,
.balloon {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 10;
}

.balloon > path.bg {
  fill: black;
  stroke: none;
}

.balloon > path.fg {
  fill: white;
  stroke: white;
  stroke-width: 1px;
}
`}
    </style>
  )
}

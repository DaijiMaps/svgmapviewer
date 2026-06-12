/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useRef, type PropsWithChildren, type ReactNode } from 'react'

import { boxToViewBox2 } from '../box/prefixed'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  Z_INDEX_BALLOON,
} from '../css'
import { type BalloonPaths } from './balloon-common'
import { useBalloonStyleRef, useDetailStyleRef } from './style'
import { useBalloonPaths } from './ui-xstate'

export function Balloon(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useDetailStyleRef(ref, 'balloon')
  useBalloonStyleRef(ref, 'balloon')

  const balloonPaths = useBalloonPaths()

  return (
    <div ref={ref} className="balloon">
      {balloonPaths && (
        <BalloonSvg {...balloonPaths}>
          <path className="bg" d={balloonPaths.bg} />
          <path className="fg" d={balloonPaths.fg} />
          <style>{style1}</style>
        </BalloonSvg>
      )}
      <style>{style}</style>
    </div>
  )
}

const style = `
.balloon,
.balloon-svg {
  ${position_absolute_left_0_top_0}
  ${pointer_events_none}
  z-index: ${Z_INDEX_BALLOON};
  will-change: opacity, transform;
}
`

function BalloonSvg({
  viewBox,
  width,
  height,
  children,
}: Readonly<PropsWithChildren<BalloonPaths>>): ReactNode {
  return (
    <svg
      className="balloon-svg"
      viewBox={viewBox && boxToViewBox2(viewBox)}
      width={width}
      height={height}
    >
      {children}
    </svg>
  )
}

const style1 = `
path.bg {
  fill: black;
  stroke: none;
}

path.fg {
  fill: white;
  stroke: white;
  stroke-width: 1px;
}
`

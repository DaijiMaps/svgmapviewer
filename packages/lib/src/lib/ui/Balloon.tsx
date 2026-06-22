/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import {
  useRef,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from 'react'

import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  Z_INDEX_BALLOON,
} from '../css'
import {
  useBalloonPathStyleRef,
  useBalloonStyleRef,
  useDetailStyleRef,
} from './style'

export function Balloon(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const bgRef = useRef<SVGPathElement>(null)
  const fgRef = useRef<SVGPathElement>(null)

  useDetailStyleRef(ref, 'balloon')
  useBalloonStyleRef(ref, 'balloon')
  useBalloonPathStyleRef(svgRef, bgRef, fgRef, 'balloon')

  return (
    <div ref={ref} className="balloon">
      <BalloonSvg ref={svgRef}>
        <path ref={bgRef} className="bg" />
        <path ref={fgRef} className="fg" />
        <style>{style1}</style>
      </BalloonSvg>
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
  ref,
  children,
}: Readonly<
  PropsWithChildren<{ ref: RefObject<SVGSVGElement | null> }>
>): ReactNode {
  return (
    <svg
      ref={ref}
      className="balloon-svg"
      viewBox="0 0 0 0"
      width={0}
      height={0}
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

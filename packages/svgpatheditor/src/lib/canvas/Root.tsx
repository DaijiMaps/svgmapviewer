/* eslint-disable react-hooks/refs */
import { useRef, type ReactNode } from 'react'
import { boxToViewBox2 } from 'svgmapviewer/box'
import type { VecVec } from 'svgmapviewer/vec'
import { Grid } from './Grid'
import { Points, pointsAdd, usePoints } from './Points'
import { sizeToViewBox } from './utils'

export interface CanvasProps {
  size: VecVec
  unit: number
}

export function Canvas(props: Readonly<CanvasProps>): ReactNode {
  const gridRef = useRef<SVGGraphicsElement>(null)

  const points = usePoints()

  // XXX
  const { clientWidth, clientHeight } = document.body

  return (
    <div
      className="canvas"
      onClick={(ev) => pointsAdd({ x: ev.clientX, y: ev.clientY })}
    >
      <svg viewBox={boxToViewBox2(sizeToViewBox(props.size))}>
        <g>
          <Grid ref={gridRef} size={props.size} unit={props.unit} />
          {gridRef.current ? (
            <Points grid={gridRef.current} points={points} />
          ) : (
            <></>
          )}
        </g>
      </svg>
      <svg viewBox={`0 0 ${clientWidth} ${clientHeight}`}></svg>
      <style>{style}</style>
    </div>
  )
}

const style = `
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  background-color: lightgrey;
}

.canvas {
  position: absolute;
  left: 0;
  top: 0;

  & > svg {
    position: absolute;
    left: 0;
    top: 0;

    display: block;
    width: 100vw;
    height: 100vh;
    
    background: none;
  }
}
`

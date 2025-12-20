/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { type OsmRenderMapProps } from '../../types'
import { useLayout2 } from '../style/style-react'
import { useFloors } from '../viewer/floors-react'

export function RenderFloors(props: Readonly<OsmRenderMapProps>): ReactNode {
  const { viewBox, width, height } = useLayout2()
  const { fidxToOnAnimationEnd } = useFloors()

  const origViewBox = props.data.origViewBox
  const floorsConfig = props.floors

  return floorsConfig === undefined ? (
    <></>
  ) : (
    <div className="content">
      <svg viewBox={viewBox} width={width} height={height}>
        {floorsConfig.floors.map(({ href }, idx) => (
          <image
            key={idx}
            className={`floor fidx-${idx}`}
            href={href}
            x={origViewBox.x}
            y={origViewBox.y}
            width={origViewBox.width}
            height={origViewBox.height}
            onAnimationEnd={fidxToOnAnimationEnd(idx)}
          />
        ))}
      </svg>
    </div>
  )
}

export function isFloorsRendered(): boolean {
  return true
}

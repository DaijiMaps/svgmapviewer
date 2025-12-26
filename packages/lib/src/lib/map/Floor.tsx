/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { type OsmRenderMapProps } from '../../types'
import { useLayout2 } from '../style/style-react'
import { useFloors, useImage } from '../viewer/floors-react'

// XXX
// XXX use blob
// XXX

export function RenderFloors(props: Readonly<OsmRenderMapProps>): ReactNode {
  const { viewBox, width, height } = useLayout2()

  const floorsConfig = props.floors

  return floorsConfig === undefined ? (
    <></>
  ) : (
    <div className="content">
      <svg viewBox={viewBox} width={width} height={height}>
        {floorsConfig.floors.map((_floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorImage {...props} idx={idx} />
          </Fragment>
        ))}
      </svg>
    </div>
  )
}

export function RenderFloorImage({
  idx,
  data: { origViewBox },
}: Readonly<OsmRenderMapProps & { idx: number }>): ReactNode {
  const { fidxToOnAnimationEnd } = useFloors()

  const url = useImage(idx)

  return url === undefined ? (
    <text>
      <tspan>Loading...</tspan>
    </text>
  ) : (
    <image
      key={idx}
      className={`floor fidx-${idx}`}
      href={url}
      x={origViewBox.x}
      y={origViewBox.y}
      width={origViewBox.width}
      height={origViewBox.height}
      onAnimationEnd={fidxToOnAnimationEnd(idx)}
    />
  )
}

export function isFloorsRendered(): boolean {
  return true
}

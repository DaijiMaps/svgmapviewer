/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { type OsmRenderMapProps } from '../../types'
import type { BoxBox } from '../box/prefixed'
import { useLayout2 } from '../style/style-react'
import { useFloorImageUrl, useFloors } from '../viewer/floors-react'

export function RenderFloors({
  floors,
  data: { origViewBox },
}: Readonly<OsmRenderMapProps>): ReactNode {
  const { viewBox, width, height } = useLayout2()

  return floors === undefined ? (
    <></>
  ) : (
    <div className="content">
      <svg viewBox={viewBox} width={width} height={height}>
        {floors.floors.map((_floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorImage origViewBox={origViewBox} idx={idx} />
          </Fragment>
        ))}
      </svg>
    </div>
  )
}

export function RenderFloorImage({
  origViewBox,
  idx,
}: Readonly<{ origViewBox: BoxBox; idx: number }>): ReactNode {
  const { fidxToOnAnimationEnd } = useFloors()

  const url = useFloorImageUrl(idx)

  // XXX better "loading" display?
  return url === undefined ? (
    <></>
  ) : (
    <image
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

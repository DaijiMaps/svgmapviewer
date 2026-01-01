/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { type OsmRenderMapProps } from '../../types'
import type { BoxBox } from '../box/prefixed'
import { useLayout2 } from '../style/style-react'
import { useFloors } from '../viewer/floors/floors-react'
import type { Cb } from '../cb'

export function RenderFloors({
  floors,
  data: { origViewBox },
}: Readonly<OsmRenderMapProps>): ReactNode {
  const { viewBox, width, height } = useLayout2()

  const { fidxToOnAnimationEnd, urls } = useFloors()

  return floors === undefined ? (
    <></>
  ) : (
    <div className="content">
      <svg viewBox={viewBox} width={width} height={height}>
        {floors.floors.map((_floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorImage
              origViewBox={origViewBox}
              idx={idx}
              url={urls.get(idx)}
              onAnimationEnd={fidxToOnAnimationEnd(idx)}
            />
          </Fragment>
        ))}
      </svg>
    </div>
  )
}

type Props = Readonly<{
  origViewBox: BoxBox
  idx: number
  url?: string
  onAnimationEnd?: Cb
}>

function RenderFloorImage({
  origViewBox,
  idx,
  url,
  onAnimationEnd,
}: Props): ReactNode {
  // XXX better "loading" display?
  return (
    <image
      className={`floor fidx-${idx}`}
      href={url}
      x={origViewBox.x}
      y={origViewBox.y}
      width={origViewBox.width}
      height={origViewBox.height}
      onAnimationEnd={onAnimationEnd}
    />
  )
}

// XXX check if all urls are loaded?
export function isFloorsRendered(): boolean {
  return true
}

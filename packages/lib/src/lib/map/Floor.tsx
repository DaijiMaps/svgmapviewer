/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { useLayout2 } from '../../style-xstate'
import type { FloorsConfig } from '../../types'
import { useFloors } from '../viewer/floors-xstate'

export function RenderFloors(): ReactNode {
  const { viewBox, width, height } = useLayout2()

  const { floorsConfig } = svgMapViewerConfig

  if (floorsConfig === undefined) {
    return <></>
  }

  return (
    <svg viewBox={viewBox} width={width} height={height}>
      {floorsConfig.floors.map(({ href }, idx) => (
        <Fragment key={idx}>
          <RenderFloorImage
            _floorsConfig={floorsConfig}
            _href={href}
            _idx={idx}
          />
        </Fragment>
      ))}
    </svg>
  )
}

function RenderFloorImage(
  props: Readonly<{ _floorsConfig: FloorsConfig; _href: string; _idx: number }>
): ReactNode {
  const { _href: href, _idx: idx } = props
  const { fidxToOnAnimationEnd } = useFloors()
  const {
    origViewBox: { x, y, width, height },
  } = svgMapViewerConfig

  const hw = width / 2
  const hh = height / 2

  return (
    <image
      className={`floor fidx-${idx}`}
      href={href}
      onAnimationEnd={fidxToOnAnimationEnd(idx)}
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        transformOrigin: 'left top',
        transform: `translate(${hw}px, ${hh}px) rotate(90deg) translate(${-hw}px, ${-hh}px)`,
      }}
    />
  )
}

export function isFloorsRendered(): boolean {
  return true
}

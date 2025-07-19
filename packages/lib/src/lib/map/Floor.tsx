/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { useLayout2 } from '../../style-xstate'
import { useFloors } from '../viewer/floors-xstate'

export function RenderFloors(): ReactNode {
  const { viewBox, width, height } = useLayout2()
  const { fidxToOnAnimationEnd } = useFloors()

  const { origViewBox, floorsConfig } = svgMapViewerConfig

  if (floorsConfig === undefined) {
    return <></>
  }

  return (
    <svg viewBox={viewBox} width={width} height={height}>
      {floorsConfig.floors.map(({ href }, idx) => (
        <image
          key={idx}
          className={`floor fidx-${idx}`}
          href={href}
          onAnimationEnd={fidxToOnAnimationEnd(idx)}
          x={origViewBox.x}
          y={origViewBox.y}
          width={origViewBox.width}
          height={origViewBox.height}
        />
      ))}
    </svg>
  )
}

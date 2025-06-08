/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxMap, boxScaleAtCenter, boxToViewBox } from './lib/box/prefixed'
import { renderShadowRoot } from './lib/dom'
import {
  MAP_SVG_LABELS_CONTENT_ID,
  MAP_SVG_LABELS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import './MapSvgLabels.css'
import { MapSvgLabelsStyle } from './MapSvgStyle'

export function MapSvgLabelsRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useEffect(
    // eslint-disable-next-line functional/no-return-void
    () => renderShadowRoot(MAP_SVG_LABELS_ROOT_ID, <MapSvgLabels />),
    []
  )

  return <div id={MAP_SVG_LABELS_ROOT_ID} className="content svg" />
}

export function MapSvgLabels(): ReactNode {
  return (
    <>
      <MapSvgLabelsSvg />
      <MapSvgLabelsDefs />
    </>
  )
}

function MapSvgLabelsSvg(): ReactNode {
  const { scroll } = useLayout()
  const { x, y, width, height } = boxMap(
    boxScaleAtCenter(svgMapViewerConfig.origViewBox, 3),
    trunc2
  )

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_LABELS_CONTENT_ID}
      viewBox="0 0 1 1"
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <svg
        viewBox={boxToViewBox({ x, y, width, height })}
        x={x}
        y={y}
        width={width}
        height={height}
      >
        <use href="#map-svg-labels1" />
      </svg>
    </svg>
  )
}

function MapSvgLabelsDefs(): ReactNode {
  return (
    <svg>
      <g id="map-svg-labels1">
        {/* XXX */}
        <text />
        <MapSvgLabelsStyle />
      </g>
    </svg>
  )
}

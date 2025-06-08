/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxMap, boxScaleAtCenter, boxToViewBox } from './lib/box/prefixed'
import { renderShadowRoot } from './lib/dom'
import type { POI } from './lib/geo'
import {
  MAP_SVG_LABELS_CONTENT_ID,
  MAP_SVG_LABELS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayoutSvgScaleS } from './lib/map-xstate'
import { useNames } from './lib/names'
import { useLayout } from './lib/style-xstate'
import { voffset } from './lib/text'
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
    <div>
      <MapSvgLabelsSvg />
      <MapSvgLabelsDefs />
      <style>
        {`
#map-svg-labels-svg,
#map-svg-labels1 {
  contain: layout;
  text-rendering: optimizespeed;
  shape-rendering: optimizespeed;
}
text, tspan {
  contain: layout;
}
`}
      </style>
      <MapSvgLabelsStylePos />
      <MapSvgLabelsStyleSizes />
    </div>
  )
}

function MapSvgLabelsStylePos(): ReactNode {
  const { pointNames, areaNames } = useNames()

  return (
    <style>{`
${areaNames
  .map(
    ({ id, size, pos: { x, y } }) => `
#name-${id} {
  transform: translate(${trunc2(x)}px, ${trunc2(y)}px) scale(${Math.round(size / 10) / 16});
}
`
  )
  .reduce((a, b) => a + b)}
${pointNames
  .map(
    ({ id, size, pos: { x, y } }) => `
#name-${id} {
  transform: translate(${trunc2(x)}px, ${trunc2(y)}px) scale(${Math.round(size / 10) / 16});
}
`
  )
  .reduce((a, b) => a + b)}
`}</style>
  )
}

function MapSvgLabelsStyleSizes(): ReactNode {
  const { areaNames } = useNames()
  const s = useLayoutSvgScaleS()

  // XXX
  // XXX
  // XXX
  // XXX
  // XXX
  return <></>
  // XXX
  // XXX
  // XXX
  // XXX
  // XXX

  const sizes = new Set(areaNames.map(({ size }) => Math.round(size / 10)))
  const opacities = sizes.keys().map((sz) => {
    const ss = sz / s
    const MAX = 100
    const MIN = 0
    const opacity = Math.pow(
      ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN),
      2
    )
    return { size: sz, opacity }
  })

  return (
    <style>{`
${opacities
  .map(
    ({ size, opacity }) => `
.size-${size} {
  opacity: ${opacity};
}
`
  )
  .reduce((a, b) => a + b)}
`}</style>
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
  const { pointNames, areaNames } = useNames()

  return (
    <svg>
      <g id="map-svg-labels1">
        <g>
          {pointNames.map((poi, idx) => (
            <Fragment key={idx}>
              <RenderName _poi={poi} />
            </Fragment>
          ))}
        </g>
        <g>
          {areaNames.map((poi, idx) => (
            <Fragment key={idx}>
              <RenderName _poi={poi} />
            </Fragment>
          ))}
        </g>
        <MapSvgLabelsStyle />
      </g>
    </svg>
  )
}

function RenderName(props: Readonly<{ _poi: POI }>): ReactNode {
  const { id, name, size } = props._poi
  const sz = Math.round(size / 10)
  return (
    <text id={`name-${id}`} className={`size-${sz}`}>
      {name.map((n, j) => (
        <Fragment key={j}>
          <tspan
            textAnchor="middle"
            alignmentBaseline="middle"
            x="0"
            y={trunc2(voffset(name.length, j) * 16)}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {n}
          </tspan>
          <tspan
            textAnchor="middle"
            alignmentBaseline="middle"
            x="0"
            y={trunc2(voffset(name.length, j) * 16)}
            fill="black"
          >
            {n}
          </tspan>
        </Fragment>
      ))}
    </text>
  )
}

/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode, useEffect, useMemo } from 'react'
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
  useEffect(
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
      <style>
        {`
#map-svg-labels-svg,
#map-svg-labels1 {
  contain: content;
}
#map-svg-labels-defs {
  display: none;
}
text, tspan {
  contain: layout;
}
`}
      </style>
      <MapSvgLabelsStylePos />
      <MapSvgLabelsStyleSizes />
    </>
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
  const { sizes } = useNames()
  const s = useLayoutSvgScaleS()

  const opacities = useMemo(() => getOpacities(sizes, s), [s, sizes])

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
    <svg id="map-svg-labels-defs">
      <defs>
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
      </defs>
    </svg>
  )
}

function RenderName(props: Readonly<{ _poi: POI }>): ReactNode {
  const { id, name } = props._poi
  const { sizeMap } = useNames()

  const sz = id === null ? undefined : sizeMap.get(id)
  return sz === undefined ? (
    <></>
  ) : (
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
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={1}
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

function getOpacities(
  sizes: readonly number[],
  scale: number
): readonly { size: number; opacity: number }[] {
  return sizes.map((size) => {
    const l = Math.pow(2, size)
    const ss = l / scale
    const MAX = 1000
    const MIN = 0
    const opacity = trunc2(
      Math.pow(ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN), 2)
    )
    return { size, opacity }
  })
}

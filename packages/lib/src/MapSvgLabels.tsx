/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode, useEffect, useMemo } from 'react'
import { boxToViewBox2 } from './lib/box/prefixed'
import { renderShadowRoot } from './lib/dom'
import type { POI } from './lib/geo'
import {
  MAP_SVG_LABELS_CONTENT_ID,
  MAP_SVG_LABELS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayoutSvgScaleS } from './lib/map-xstate'
import { useNameRanges, useNames } from './lib/names'
import { useLayout } from './lib/style-xstate'
import { voffset } from './lib/text'
import { trunc2 } from './lib/utils'

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
      <MapSvgLabelsStyleRanges />
      <MapSvgLabelsStyleSizes />
      <style>{style}</style>
    </>
  )
}

const style = `
#map-svg-labels-svg,
#map-svg-labels1 {
  contain: content;
  pointer-events: none;
}
#map-svg-labels-defs {
  display: none;
}
text, tspan {
  contain: layout;
}
`

function MapSvgLabelsUses(): ReactNode {
  const { pointNames, areaNames } = useNames()

  return (
    <g id="map-svg-labels1">
      <g>
        {pointNames.map(({ id, pos: { x, y }, size }, idx) => (
          <use
            key={idx}
            href={`#name-${id}`}
            style={{
              transform: `translate(${trunc2(x)}px, ${trunc2(y)}px) scale(${Math.round(size / 10) / 16})`,
            }}
          />
        ))}
      </g>
      <g>
        {areaNames.map(({ id, pos: { x, y }, size }, idx) => (
          <use
            key={idx}
            id={`use-${id}`}
            href={`#name-${id}`}
            style={{
              transform: `translate(${trunc2(x)}px, ${trunc2(y)}px) scale(${Math.round(size / 10) / 16})`,
            }}
          />
        ))}
      </g>
    </g>
  )
}

function MapSvgLabelsStyleRanges(): ReactNode {
  const { areaRange } = useNameRanges()

  const iids = Array.from(areaRange.insides.keys())
    .map((id) => `#use-${id}`)
    .join(', ')
  const oids = Array.from(areaRange.outsides.keys())
    .map((id) => `#use-${id}`)
    .join(', ')

  return (
    <style>{`
${iids} {
  display: initial;
}
${oids} {
  display: none;
}
/* define these to kick style re-calculation */
use {
  --n-insides: ${iids.length};
  --n-outsides: ${oids.length};
}
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
  const { scroll, svg } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_LABELS_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map-svg-labels1" />
    </svg>
  )
}

function MapSvgLabelsDefs(): ReactNode {
  const { pointNames, areaNames } = useNames()

  return (
    <svg id="map-svg-labels-defs">
      <defs>
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
      </defs>
      <MapSvgLabelsUses />
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

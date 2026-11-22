import { useAtom } from '@xstate/store-react'
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { Fragment, useRef, type PropsWithChildren, type ReactNode } from 'react'

import { useConfig } from '../../../config'
import {
  type Floor,
  type FloorsConfig,
  type LabelText,
  type OsmRenderMapProps,
} from '../../../types'
import type { BoxBox } from '../../box/prefixed'
import { floor_appearing_animation } from '../../css'
import { usePosition } from '../../position'
import { useLayout2 } from '../../style/style-react'
import {
  useFloors,
  type UseFloorsReturn,
} from '../../viewer/floors/floors-react'
import { floorsSend, urlsAtom } from '../../viewer/floors/floors-xstate'
import { useFloorRef } from '../../viewer/floors/style'
import { useLayoutStyleRef } from '../../viewer/layout/style-layout'
import { MAP_SVG_FLOORS } from '../map-svg-react'
import { getLabels } from './labels'
import type { FloorProps } from './types'

export function RenderFloorsSvg({
  floors,
  data: { origViewBox, mapCoord },
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutStyleRef(ref, 'map-floors-svg')
  const ctx = useFloors()
  return (
    <div ref={ref} className="content map-floors-svg">
      <RenderFloorsSvgSvg>
        {floors?.floors.map((floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorSvg
              fidx={ctx.fidx}
              idx={idx}
              floor={floor}
              labelsMap={floors?.labelsMap}
              origViewBox={origViewBox}
              ctx={ctx}
              m={mapCoord.matrix}
              meter2svg={mapCoord.meter2svg}
            />
          </Fragment>
        ))}
      </RenderFloorsSvgSvg>
      <style>{svgStyle}</style>
    </div>
  )
}

const svgStyle = `
svg.content-svg {
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
}
${floor_appearing_animation}
`

function RenderFloorsSvgSvg(props: Readonly<PropsWithChildren>): ReactNode {
  const ref = useRef(null)
  const { viewBox } = useLayout2()
  useLayoutStyleRef(ref, `floors-svg`)

  // only this part is re-rendered after zoom (viewbox change)
  return (
    <svg
      ref={ref}
      id={MAP_SVG_FLOORS}
      className="content-svg"
      viewBox={viewBox}
    >
      {props.children}
    </svg>
  )
}

function RenderFloorSvg({
  idx,
  floor,
  origViewBox,
  labelsMap,
  m,
  meter2svg,
}: Readonly<{
  fidx: number
  idx: number
  floor: Floor
  origViewBox: BoxBox
  ctx: UseFloorsReturn
  labelsMap?: FloorsConfig['labelsMap']
  m?: DOMMatrixReadOnly
  meter2svg?: number
}>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `svg-${idx}`)
  return (
    <g
      ref={ref}
      className={`floor fidx-${idx}`}
      onAnimationEnd={() => floorsSend({ type: 'ANIMATION.END', idx })}
    >
      <RenderFloorImages
        origViewBox={origViewBox}
        names={floor.layers ?? [floor.name]}
      />
      {m && meter2svg && (
        <RenderFloorPositionCircle m={m} meter2svg={meter2svg} />
      )}
      <RenderFloorLabelCircles
        idx={idx}
        labels={floor.labels ?? getLabels(labelsMap, floor.name.toLowerCase())}
      />
      <style>{floorSvgStyle}</style>
    </g>
  )
}

const floorSvgStyle = `
.position-circle {
  fill-opacity: 0.5;
  animation: pulsing 5s linear infinite;
}

@keyframes pulsing {
  0% {
    transform: scale(0);
    fill-opacity: 0.5;
  }
  25% {
    transform: scale(1);
    fill-opacity: 0;
  }
  100% {
    transform: scale(1);
    fill-opacity: 0;
  }
}
`

function RenderFloorImages({ origViewBox, names }: FloorProps): ReactNode {
  const urls = useAtom(urlsAtom)
  // XXX better "loading" display?
  return (
    <g className="images">
      {names.map((name, idx) => (
        <image
          key={idx}
          x={origViewBox.x}
          y={origViewBox.y}
          width={origViewBox.width}
          height={origViewBox.height}
          href={urls.get(name)}
        />
      ))}
    </g>
  )
}

function RenderFloorPositionCircle({
  m,
  meter2svg,
}: Readonly<{ m: DOMMatrixReadOnly; meter2svg: number }>): ReactNode {
  const { x, y, r } = usePositionSvg(m, meter2svg)
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle className="position-circle" r={r} fill="red" />
    </g>
  )
}

function usePositionSvg(
  m: DOMMatrixReadOnly,
  meter2svg: number
): {
  x: number
  y: number
  r: number
} {
  const position = usePosition()
  // XXX scale accuracy (m) to svg
  const { x, y } = m.transformPoint({
    x: position?.coords.longitude ?? 0,
    y: position?.coords.latitude ?? 0,
  })
  const r = (position?.coords.accuracy ?? 0) * meter2svg
  return {
    x,
    y,
    r,
  }
}

function RenderFloorLabelCircles({
  labels,
}: Readonly<{
  idx: number
  labels?: readonly LabelText[]
}>): ReactNode {
  const cfg = useConfig()
  return cfg?.floorsConfig?.labelsCircleRadius === undefined ? (
    <></>
  ) : (
    <g className="label-circles">
      {labels?.map((_text, idx) => (
        <circle
          className="label-circle"
          key={idx}
          cx={Number(_text.attrs?.['x']) || 0}
          cy={Number(_text.attrs?.['y']) || 0}
          r={cfg?.floorsConfig?.labelsCircleRadius}
        ></circle>
      ))}
      <style>{cfg?.floorsConfig?.labelsCircleStyle}</style>
    </g>
  )
}

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
import { useFloorRef } from '../../viewer/floors/style'
import { useLayoutStyleRef } from '../../viewer/layout/style'
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
        {floors?.floors.map((floor, fidx) => (
          <Fragment key={fidx}>
            <RenderFloorSvg
              fidx={fidx}
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
  fidx,
  floor,
  origViewBox,
  ctx: { fidxToOnAnimationEnd, urls },
  labelsMap,
  m,
  meter2svg,
}: Readonly<{
  fidx: number
  floor: Floor
  origViewBox: BoxBox
  ctx: UseFloorsReturn
  labelsMap?: FloorsConfig['labelsMap']
  m?: DOMMatrixReadOnly
  meter2svg?: number
}>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `svg-${fidx}`)
  return (
    <g
      ref={ref}
      className={`floor fidx-${fidx}`}
      onAnimationEnd={fidxToOnAnimationEnd(fidx)}
    >
      <RenderFloorImage
        fidx={fidx}
        origViewBox={origViewBox}
        url={urls.get(fidx)}
      />
      {m && meter2svg && (
        <RenderFloorPositionCircle m={m} meter2svg={meter2svg} />
      )}
      <RenderFloorLabelCircles
        fidx={fidx}
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

function RenderFloorImage({ origViewBox, url }: FloorProps): ReactNode {
  // XXX better "loading" display?
  return (
    <g className="images">
      <image
        x={origViewBox.x}
        y={origViewBox.y}
        width={origViewBox.width}
        height={origViewBox.height}
        href={url}
      />
    </g>
  )
}

function RenderFloorPositionCircle({
  m,
  meter2svg,
}: Readonly<{ m: DOMMatrixReadOnly; meter2svg: number }>): ReactNode {
  const { x, y, r } = usePositionSvg(m, meter2svg)
  return <circle className="position-circle" cx={x} cy={y} r={r} fill="red" />
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
  fidx: number
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

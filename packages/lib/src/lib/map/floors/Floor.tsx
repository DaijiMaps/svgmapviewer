/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import {
  Fragment,
  useRef,
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

import {
  type Floor,
  type LabelsMap,
  type LabelText,
  type OsmRenderMapProps,
} from '../../../types'
import { floor_appearing_animation } from '../../css'
import { useLayout2 } from '../../style/style-react'
import {
  useFloors,
  type UseFloorsReturn,
} from '../../viewer/floors/floors-react'
import { useFloorRef } from '../../viewer/floors/style'
import { useZoomStyleRef } from '../../viewer/layout/style'
import { MAP_SVG_FLOORS } from '../map-svg-react'
import type { FloorProps } from './types'

export function RenderFloors(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <>
      <RenderFloorsSvg {...props} />
      <RenderFloorsHtml {...props} />
    </>
  )
}

function RenderFloorsSvg({
  floors,
  ...rest
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ctx = useFloors()
  return (
    <div className="content map-floors-svg">
      <RenderFloorsSvgSvg>
        {(floors?.floors ?? []).map((floor, idx) => (
          <Fragment key={idx}>
            <RenderFloor
              floors={floors}
              {...rest}
              ctx={ctx}
              floor={floor}
              idx={idx}
              labelsMap={floors?.labelsMap}
            />
          </Fragment>
        ))}
      </RenderFloorsSvgSvg>
      <style>{`
svg.content-svg {
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
}
${floor_appearing_animation}
`}</style>
    </div>
  )
}

function RenderFloorsSvgSvg(props: Readonly<PropsWithChildren>): ReactNode {
  const { viewBox } = useLayout2()

  // only this part is re-rendered after zoom (viewbox change)
  return (
    <svg id={MAP_SVG_FLOORS} className="content-svg" viewBox={viewBox}>
      {props.children}
    </svg>
  )
}

function RenderFloorsHtml({
  floors,
  ...rest
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ctx = useFloors()
  return (
    <div className="content">
      <div className="map-floors-html">
        {(floors?.floors ?? []).map((floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorHtml
              floors={floors}
              {...rest}
              ctx={ctx}
              floor={floor}
              idx={idx}
              labelsMap={floors?.labelsMap}
            />
          </Fragment>
        ))}
      </div>
      <style>{htmlStyle}</style>
    </div>
  )
}

const htmlStyle = `
.map-floors-html {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
  transform: var(--layout-svg-to-content-matrix) !important;
  transform-origin: left top !important;
}
`

function RenderFloor({
  data: { origViewBox },
  ctx: { fidxToOnAnimationEnd, urls },
  floor,
  idx,
  labelsMap,
}: Readonly<
  OsmRenderMapProps & { ctx: UseFloorsReturn } & {
    floor: Floor
    idx: number
    labelsMap: LabelsMap | undefined
  }
>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `svg-${idx}`)
  return (
    <g
      ref={ref}
      className={`floor fidx-${idx}`}
      onAnimationEnd={fidxToOnAnimationEnd(idx)}
    >
      <RenderFloorImage
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        onAnimationEnd={fidxToOnAnimationEnd(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
    </g>
  )
}

function RenderFloorHtml({
  data: { origViewBox },
  ctx: { urls },
  floor,
  idx,
  labelsMap,
}: Readonly<
  OsmRenderMapProps & { ctx: UseFloorsReturn } & {
    floor: Floor
    idx: number
    labelsMap: LabelsMap | undefined
  }
>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `html-${idx}`)
  return (
    <div ref={ref} className={`floor fidx-${idx}`}>
      <RenderFloorLabels
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
    </div>
  )
}

function RenderFloorImage({ origViewBox, url }: FloorProps): ReactNode {
  // XXX better "loading" display?
  return (
    <image
      href={url}
      x={origViewBox.x}
      y={origViewBox.y}
      width={origViewBox.width}
      height={origViewBox.height}
    />
  )
}

function RenderFloorLabels({ idx: fidx, labels }: FloorProps): ReactNode {
  const ref = useRef(null)
  useZoomStyleRef(ref, `labels-${fidx}`)
  return (
    <div ref={ref} className="labels">
      {labels?.map((_text, idx) => (
        <Fragment key={idx}>
          <RenderFloorLabel _text={_text} />
        </Fragment>
      ))}
      <style>{labelsStyle}</style>
    </div>
  )
}

type LabelProps = Readonly<{
  _text: LabelText
}>

function RenderFloorLabel({ _text }: LabelProps): ReactNode {
  return (
    <div
      className="label"
      style={
        {
          '--x': (_text.attrs?.['x'] || 0) + 'px',
          '--y': (_text.attrs?.['y'] || 0) + 'px',
          '--rotate': (_text.attrs?.['rotate'] || 0) + 'deg',
          '--scale2': (_text.attrs?.['scale2'] || 1) + '',
          '--scale1': (_text.attrs?.['scale1'] || 1) + '',
        } as CSSProperties
      }
    >
      {_text.children?.map((_tspan, idx2) => (
        <p key={idx2}>{_tspan.text ?? ''}</p>
      ))}
    </div>
  )
}

const labelsStyle = `
@property --zoom {
  syntax: '<number>';
  inherits: false;
  initial-value: 1;
}
div.labels {
  /* default */
  --zoom: 1;
  --zoom-zoom: 1;
}
div.label {
  position: absolute;
  transform-origin: left top;
  /*
  transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(var(--zoom)) scale(calc(1 / var(--zoom-zoom))) scale(var(--scale2)) scale(var(--scale1)) translate(-50%, -50%);
  */
  transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(var(--zoom)) scale(var(--scale2)) scale(var(--scale1)) translate(-50%, -50%);
  text-align: center;
  font-family: 'Noto Sans JP', 'Noto Sans', 'sans-serif' !important;
  font-weight: 200 !important;
  & > p {
    margin: 0;
  }
}
/*
div.labels.zooming > div.label {
  animation: xxx-label-scale 500ms ease;
}
@keyframes xxx-label-scale {
  from {
    --zoom: 1;
  }
  to {
    --zoom: var(--zoom-zq-inv);
  }
}
*/
`

// XXX check if all urls are loaded?
export function isFloorsRendered(): boolean {
  return true
}

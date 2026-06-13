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
import { type BoxBox } from '../../box/prefixed'
import type { Cb } from '../../cb'
import { floor_appearing_animation } from '../../css'
import { useLayout2 } from '../../style/style-react'
import {
  useFloors,
  type UseFloorsReturn,
} from '../../viewer/floors/floors-react'
import { useFloorRef } from '../../viewer/floors/style'
import { useZoomStyleRef } from '../../viewer/layout/style'
import { MAP_SVG_FLOORS } from '../map-svg-react'

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
      {/*
      <RenderFloorLabels
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        onAnimationEnd={fidxToOnAnimationEnd(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
      */}
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
      <RenderFloorHtmlLabels
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
    </div>
  )
}

/*
function useRegisterFloor(prefix: string, idx: number) {
  const register = useCallback(
    (e: Readonly<SVGGElement | HTMLDivElement | null>) =>
      registerFloorRef(e, `${prefix}-${idx}`),
    [idx, prefix]
  )
  return register
}
*/

type Props = Readonly<{
  origViewBox: BoxBox
  idx: number
  url?: string
  onAnimationEnd?: Cb
  labels?: readonly LabelText[]
}>

function RenderFloorImage({ origViewBox, url }: Props): ReactNode {
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

/*
function RenderFloorLabels({ origViewBox, url, labels }: Props): ReactNode {
  return labels === undefined ? (
    <></>
  ) : (
    <svg
      href={url}
      x={origViewBox.x}
      y={origViewBox.y}
      width={origViewBox.width}
      height={origViewBox.height}
      viewBox={boxToViewBox2(origViewBox)}
    >
      <style>{`
text, tspan {
  font-family: 'Noto Sans JP', 'Noto Sans', 'sans-serif' !important;
  font-weight: 200 !important;
}
`}</style>
      {labels.map((_text, idx) => (
        <text key={idx} {...fromAttrs(_text.attrs)}>
          {'id' in _text.attrs && 'style' in _text.attrs && (
            <style>{`#${_text.attrs['id']} { ${_text.attrs['style']}; }`}</style>
          )}
          {_text.children &&
            _text.children.map((_tspan, idx2) => (
              <tspan key={idx2} {...fromAttrs(_tspan.attrs)}>
                {_tspan.text ?? ''}
              </tspan>
            ))}
        </text>
      ))}
    </svg>
  )
}
*/

function RenderFloorHtmlLabels({ idx: fidx, labels }: Props): ReactNode {
  const ref = useRef(null)
  useZoomStyleRef(ref, `labels-${fidx}`)
  return (
    <div ref={ref} className="labels">
      {labels?.map((_text, idx) => {
        return (
          <Fragment key={idx}>
            <RenderFloorHtmlLabel _text={_text} />
          </Fragment>
        )
      })}
      <style>{htmlLabelsStyle}</style>
    </div>
  )
}

type LabelProps = Readonly<{
  _text: LabelText
}>

function RenderFloorHtmlLabel({ _text }: LabelProps): ReactNode {
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
        <p key={idx2} {...fromAttrs(_tspan.attrs)}>
          {_tspan.text ?? ''}
        </p>
      ))}
    </div>
  )
}

const htmlLabelsStyle = `
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
  transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(var(--zoom)) scale(calc(1 / var(--zoom-zoom))) scale(var(--scale2)) scale(var(--scale1)) translate(-50%, -50%);
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

// exclude namespace
const namespace_re = /^[{].*$/
// style attrib is written into <style/>
const style_re = /^style$/
// used in Inkscape but not really valid SVG
const non_svg_re = /(?:text-align)|(?:line-height)/

function fromAttrs(
  attrs: Readonly<Record<string, undefined | null | number | string>>
): Record<string, undefined | null | number | string> {
  const entries = Object.entries(attrs)
    .filter(
      ([k]) =>
        !k.match(namespace_re) && !k.match(style_re) && !k.match(non_svg_re)
    )
    .map(([k, v]) => [convAttrName(k), v])
  return Object.fromEntries(entries)
}

function convAttrName(a: string): string {
  return !a.match(/^.*-.*$/) || a.match(/^(aria|data)-.*$/) ? a : toJsx(a)
}

function toJsx(s: string): string {
  return s
    .split('-')
    .map((s, idx) => (idx === 0 ? s : toCamel(s)))
    .join('')
}

function toCamel(s: string): string {
  const m = s.match(/^(.)(.*)$/)
  return !m ? s : `${m[1].toUpperCase()}${m[2]}`
}

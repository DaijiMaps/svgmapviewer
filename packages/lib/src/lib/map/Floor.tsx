/* eslint-disable functional/no-return-void */

/* eslint-disable functional/functional-parameters */
import {
  Fragment,
  useCallback,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

import {
  type Floor,
  type LabelsMap,
  type LabelText,
  type OsmRenderMapProps,
} from '../../types'
import { boxToViewBox2, type BoxBox } from '../box/prefixed'
import type { Cb } from '../cb'
import { floor_appearing_animation } from '../css'
import { useLayout2 } from '../style/style-react'
import {
  registerFloorRef,
  useFloors,
  type UseFloorsReturn,
} from '../viewer/floors/floors-react'
import { MAP_SVG_FLOORS } from './map-svg-react'

export function RenderFloors(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <div className="content">
      <RenderFloorsSvg>
        <RenderFloorsContent {...props} />
      </RenderFloorsSvg>
      <style>{floor_appearing_animation}</style>
      <style>{`
svg.content-svg {
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
}
`}</style>
    </div>
  )
}

function RenderFloorsSvg(props: Readonly<PropsWithChildren>): ReactNode {
  const { viewBox } = useLayout2()

  // only this part is re-rendered after zoom (viewbox change)
  return (
    <svg id={MAP_SVG_FLOORS} className="content-svg" viewBox={viewBox}>
      {props.children}
    </svg>
  )
}

function RenderFloorsContent({
  floors, // FloorsConfig
  ...rest
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ctx = useFloors()

  return (
    <>
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
    </>
  )
}

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
  // stable callback
  const register = useCallback(
    (e: Readonly<SVGGElement | null>) => registerFloorRef(e, idx),
    [idx]
  )
  return (
    <g
      ref={/* stable callback */ register}
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
      <RenderFloorLabels
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        onAnimationEnd={fidxToOnAnimationEnd(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
    </g>
  )
}

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
  attrs: Record<string, undefined | null | number | string>
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

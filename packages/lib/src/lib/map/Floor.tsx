/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'

import type { Cb } from '../cb'

import { type LabelText, type OsmRenderMapProps } from '../../types'
import { boxToViewBox2, type BoxBox } from '../box/prefixed'
import { useLayout2 } from '../style/style-react'
import { useFloors } from '../viewer/floors/floors-react'
import { MAP_SVG_FLOORS } from './map-svg-react'

export function RenderFloors({
  floors,
  data: { origViewBox },
}: Readonly<OsmRenderMapProps>): ReactNode {
  const { viewBox, width, height } = useLayout2()

  const { fidxToOnAnimationEnd, urls } = useFloors()

  return floors === undefined ? (
    <></>
  ) : (
    <div className="content">
      <svg
        id={`${MAP_SVG_FLOORS}`}
        className="content-svg"
        viewBox={viewBox}
        width={width}
        height={height}
      >
        {floors.floors.map((_floor, idx) => (
          <Fragment key={idx}>
            <g
              className={`floor fidx-${idx}`}
              onAnimationEnd={fidxToOnAnimationEnd(idx)}
            >
              <RenderFloorImage
                origViewBox={origViewBox}
                idx={idx}
                url={urls.get(idx)}
                onAnimationEnd={fidxToOnAnimationEnd(idx)}
                labels={_floor.labels}
              />
              <RenderFloorLabels
                origViewBox={origViewBox}
                idx={idx}
                url={urls.get(idx)}
                onAnimationEnd={fidxToOnAnimationEnd(idx)}
                labels={_floor.labels}
              />
            </g>
          </Fragment>
        ))}
      </svg>
    </div>
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

function fromAttrs(
  attrs: Record<string, undefined | null | number | string>
): Record<string, undefined | null | number | string> {
  const entries = Object.entries(attrs)
    .filter(([k]) => !k.match(namespace_re) && !k.match(style_re))
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

/* eslint-disable functional/no-expression-statements */
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { type OsmRenderMapProps } from '../../types'
import { ZOOM_DURATION_CONTAINER } from '../css'
import { useMapStyleRef } from '../map/style'
import { type V } from '../tuple'
import { trunc2 } from '../utils'
import {
  useLayoutStyleRef,
  useSvgScaleStyleRef,
  useZoomSStyleRef,
} from '../viewer/layout/style'
import { entryToVs } from './point'
import { type RenderMapSymbolsProps } from './types'

export function RenderMapSymbols(
  props: Readonly<OsmRenderMapProps & RenderMapSymbolsProps>
): ReactNode {
  const ref = useRef<SVGGElement>(null)

  useMapStyleRef(ref, 'map-symbols')
  useZoomSStyleRef(ref, 'map-symbols')
  useSvgScaleStyleRef(ref, 'map-symbols')

  return (
    <g ref={ref} className="map-symbols">
      {props.mapSymbols.map((entry, i) => {
        return (
          <Fragment key={i}>
            <RenderUses
              name={entry.name}
              href={entry.href}
              vs={entryToVs(props.data.mapData, entry)}
              m={props.m}
            />
          </Fragment>
        )
      })}
      <style>{style}</style>
    </g>
  )
}

export function RenderMapSymbols2(
  props: Readonly<OsmRenderMapProps & RenderMapSymbolsProps>
): ReactNode {
  const ref = useRef(null)

  //useMapStyleRef(ref, 'map-symbols')
  useZoomSStyleRef(ref, 'map-symbols')
  useLayoutStyleRef(ref, 'map-symbols')
  useSvgScaleStyleRef(ref, 'map-symbols')

  return (
    <div ref={ref} className="map-symbols content-html">
      {props.mapSymbols.map((entry, i) => {
        return (
          <Fragment key={i}>
            <RenderUses2
              name={entry.name}
              href={entry.href}
              vs={entryToVs(props.data.mapData, entry)}
              m={props.m}
            />
          </Fragment>
        )
      })}
      <style>{style}</style>
    </div>
  )
}

// XXX
// XXX
// XXX
// XXX
// XXX
// XXX NOT working on Safari
// XXX
// XXX
// XXX
// XXX
// XXX

const style = `
/*
.map-symbols {
  & > .map-symbol {
    transform:
      translate(var(--map-symbol-x), var(--map-symbol-y))
      scale(calc(var(--layout-fontsize) * 1.5 * var(--layout-svgscale) / 72));
  }
  &.zooming {
    & > .map-symbol {
      will-change: transform;
      animation: xxx-map-symbol ${ZOOM_DURATION_CONTAINER}ms ease forwards;
    }
  }
}
@keyframes xxx-map-symbol {
  from {
    transform:
      translate(var(--map-symbol-x), var(--map-symbol-y))
      scale(
        calc(
          var(--layout-fontsize) *
          1.5 *
          var(--layout-svgscale) /
          72))
      translate3d(0,0,0);
  }
  to {
    transform:
      translate(var(--map-symbol-x), var(--map-symbol-y))
      scale(
        calc(
          1 / var(--zoom-s-symbols) *
          var(--layout-fontsize) *
          1.5 *
          var(--layout-svgscale) /
          72))
      translate3d(0,0,0);
  }
}
*/
`

export function RenderUses(
  props: Readonly<{ name: string; href: string; vs: V[]; m: DOMMatrixReadOnly }>
): ReactNode {
  return (
    <>
      {props.vs
        .map(([x, y]) => props.m.transformPoint({ x, y }))
        .map(({ x, y }, j) => (
          <use
            key={j}
            className={`map-symbol ${props.name} ${props.name}-${j}`}
            href={props.href}
            style={
              {
                '--map-symbol-x': `${x}px`.replaceAll(/([.]\d\d)\d*/g, '$1'),
                '--map-symbol-y': `${y}px`.replaceAll(/([.]\d\d)\d*/g, '$1'),
                display: j % 10 === 0 ? null : 'none',
              } as CSSProperties
            }
          />
        ))}
    </>
  )
}

export function RenderUses2(
  props: Readonly<{ name: string; href: string; vs: V[]; m: DOMMatrixReadOnly }>
): ReactNode {
  return (
    <>
      {props.vs
        .map(([x, y]) => props.m.transformPoint({ x, y }))
        .map(({ x, y }, j) => (
          <div
            key={j}
            className={`map-symbol ${props.name} ${props.name}-${j}`}
            style={
              {
                '--poi-x': `${trunc2(x)}px`,
                '--poi-y': `${trunc2(y)}px`,
                display: j % 5 === 0 ? null : 'none',
              } as CSSProperties
            }
          >
            <svg viewBox="-36 -36 72 72" width="72" height="72">
              <use href={props.href} />
            </svg>
          </div>
        ))}
    </>
  )
}

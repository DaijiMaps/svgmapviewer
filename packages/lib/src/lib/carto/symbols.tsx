/* eslint-disable functional/no-expression-statements */
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { type OsmRenderMapProps } from '../../types'
import { useMapStyleRef } from '../map/style'
import { type V } from '../tuple'
import { useLayoutStyleRef, useZoomSStyleRef } from '../viewer/layout/style'
import { entryToVs } from './point'
import { type RenderMapSymbolsProps } from './types'

export function RenderMapSymbols(
  props: Readonly<OsmRenderMapProps & RenderMapSymbolsProps>
): ReactNode {
  const ref = useRef<SVGGElement>(null)

  useMapStyleRef(ref, 'map-symbols')
  useLayoutStyleRef(ref, 'map-symbols')
  useZoomSStyleRef(ref, 'map-symbols')

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

const style = `
.map-symbols {
  & > .map-symbol {
    translate: var(--map-symbol-x) var(--map-symbol-y);
    scale: calc(var(--layout-fontsize) * 1.5 * var(--layout-svgscale) / 72);
  }
  &.zooming {
    & > .map-symbol {
      will-change: scale;
      animation: xxx-map-symbol 500ms ease;
    }
  }
}
@keyframes xxx-map-symbol {
  from {
    scale:
      calc(
        var(--layout-fontsize) *
        1.5 *
        var(--layout-svgscale) /
        72);
  }
  to {
    scale:
      calc(
        1 / var(--zoom-s) *
        var(--layout-fontsize) *
        1.5 *
        var(--layout-svgscale) /
        72);
  }
}
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
              } as CSSProperties
            }
          />
        ))}
    </>
  )
}

/* eslint-disable functional/no-expression-statements */
import { useRef, type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { type OsmRenderMapProps } from '../../types'
import { useMapStyleRef } from '../map/style'
import { type V } from '../tuple'
import { useLayoutStyleRef, useZoomStyleRef } from '../viewer/layout/style'
import { entryToVs } from './point'
import { type RenderMapSymbolsProps } from './types'

export function RenderMapSymbols(
  props: Readonly<OsmRenderMapProps & RenderMapSymbolsProps>
): ReactNode {
  const ref = useRef<SVGGElement>(null)

  useMapStyleRef(ref, 'map-symbols')
  useLayoutStyleRef(ref, 'map-symbols')
  useZoomStyleRef(ref, 'map-symbols')

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
  --zoom-s-inv-symbols: var(--zoom-s-inv);
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
            className={`${props.name} ${props.name}-${j}`}
            href={props.href}
            style={{
              transform:
                `translate(${x}px, ${y}px)`.replaceAll(/([.]\d\d)\d*/g, '$1') +
                `scale(var(--zoom-s-inv-symbols))` +
                //`scale(calc(var(--layout-fontsize) * var(--layout-svgscale) * var(--map-symbol-size-k))`,
                //`scale(calc(var(--layout-fontsize) * var(--layout-svgscale) * var(--map-symbol-size-k) / 72))`,
                `scale(calc(var(--layout-fontsize) * 1.5 * var(--layout-svgscale) / 72))`,
            }}
          />
        ))}
    </>
  )
}

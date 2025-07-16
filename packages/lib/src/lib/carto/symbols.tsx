import { type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { type V } from '../tuple'
import { entryToVs } from './point'
import type { RenderMapSymbolsProps } from './types'

export function RenderMapSymbols(
  props: Readonly<RenderMapSymbolsProps>
): ReactNode {
  return (
    <g className="map-symbols">
      {props.mapSymbols.map((entry, i) => {
        return (
          <Fragment key={i}>
            <g className={entry.name}>
              <RenderUses
                name={entry.name}
                href={entry.href}
                vs={entryToVs(entry)}
                m={props.m}
              />
            </g>
          </Fragment>
        )
      })}
    </g>
  )
}

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
            className={`${props.name}-${j}`}
            href={props.href}
            style={{
              transform:
                `translate(${x}px, ${y}px)`.replaceAll(/([.]\d\d)\d*/g, '$1') +
                `scale(var(--map-symbol-size))`,
            }}
          />
        ))}
    </>
  )
}

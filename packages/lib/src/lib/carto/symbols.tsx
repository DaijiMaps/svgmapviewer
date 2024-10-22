import { V } from '../tuple'
import { RenderMapProps } from '../types'

export interface RenderMapSymbolsProps extends RenderMapProps {
  mapSymbols: MapSymbols[]
}

export function RenderMapSymbols(props: Readonly<RenderMapSymbolsProps>) {
  const { config, svgScale } = props.layout
  const sz = config.fontSize * svgScale.s * 1.5

  return (
    <g>
      {props.mapSymbols.map(({ href, vs }, i) => (
        <g key={i}>
          <RenderUses href={href} sz={sz} vs={vs} />
        </g>
      ))}
    </g>
  )
}

export interface MapSymbols {
  name: string
  href: string
  vs: V[]
}

export function RenderUses(
  props: Readonly<{ href: string; vs: V[]; sz: number }>
) {
  return (
    <>
      {props.vs.map(([x, y], j) => (
        <use
          key={j}
          href={props.href}
          transform={`translate(${x}, ${y}) scale(${props.sz / 72})`}
        />
      ))}
    </>
  )
}

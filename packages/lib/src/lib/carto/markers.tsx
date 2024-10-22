import { V } from '../tuple'
import { RenderMapProps } from '../types'

export interface RenderMapMarkersProps extends RenderMapProps {
  mapMarkers: MapMarkers[]
}

export function RenderMapMarkers(props: Readonly<RenderMapMarkersProps>) {
  const { config, svgScale } = props.layout
  const sz = svgScale.s * config.fontSize * 0.9

  return (
    <g>
      {props.mapMarkers.map(({ /* XXX name,*/ vs }, i) => (
        <g key={i}>
          <RenderMarkers vs={vs} sz={sz} />
        </g>
      ))}
    </g>
  )
}

export interface MapMarkers {
  name: string
  vs: V[]
}

export function RenderMarkers(props: Readonly<{ vs: V[]; sz: number }>) {
  const h = (props.sz * 1.5) / 2
  const r = Math.sqrt(2) * h
  return (
    <path
      fill="white"
      fillOpacity="1"
      stroke="gray"
      strokeWidth={r / 20}
      d={props.vs
        .map(
          ([x, y]) => `M ${x},${y} l ${-h},${-h} a ${r},${r} 0,1,1 ${2 * h},0 z`
        )
        .join('')}
    />
  )
}

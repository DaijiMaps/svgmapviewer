import { V } from '../tuple'

export function RenderMapObjects(
  props: Readonly<{
    mapObjects: MapObjects[]
  }>
) {
  return (
    <g>
      {props.mapObjects.map(({ path, width, vs }, i) => (
        <g key={i}>
          <RenderObjects path={path} width={width} vs={vs} />
        </g>
      ))}
    </g>
  )
}

export interface MapObjects {
  name: string
  path: string
  width: number
  vs: V[]
}

export function RenderObjects(
  props: Readonly<{ width: number; path: string; vs: V[] }>
) {
  return (
    <path
      fill="none"
      stroke="black"
      strokeWidth={props.width}
      d={props.vs.map(([x, y]) => `M ${x},${y}` + props.path).join('')}
    />
  )
}

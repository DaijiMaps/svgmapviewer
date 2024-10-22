import { Parking } from './symbols/Parking'
import { Toilets } from './symbols/Toilets'

export function RenderMapAssets() {
  return (
    <g className="assets">
      <Symbols />
    </g>
  )
}

export function Symbols() {
  return (
    <g className="symbols">
      <Parking />
      <Toilets />
    </g>
  )
}

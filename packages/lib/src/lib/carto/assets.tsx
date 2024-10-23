import { Parking, Toilets } from './symbols/index'

export function RenderMapAssetsDefault() {
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

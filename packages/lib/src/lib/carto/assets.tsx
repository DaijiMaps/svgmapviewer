import { DrinkingFountain, Escalator, Elevator, Parking, Toilets } from './symbols/index'

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
      <DrinkingFountain />
      <Elevator />
      <Escalator />
      <Parking />
      <Toilets />
    </g>
  )
}

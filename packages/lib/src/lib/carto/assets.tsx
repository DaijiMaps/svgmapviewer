import {
  Bus,
  DrinkingFountain,
  Elevator,
  Escalator,
  Information,
  Parking,
  Toilets,
} from './symbols/index'

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
      <Bus />
      <DrinkingFountain />
      <Elevator />
      <Escalator />
      <Information />
      <Parking />
      <Toilets />
    </g>
  )
}

/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import {
  Bus,
  DrinkingFountain,
  Elevator,
  Escalator,
  Information,
  Parking,
  Stairs,
  Toilets,
} from './symbols/index'

export function RenderMapAssetsDefault(): ReactNode {
  return (
    <g className="assets">
      <SymbolAssets />
    </g>
  )
}

export function SymbolAssets(): ReactNode {
  return (
    <g className="symbols">
      <Bus />
      <DrinkingFountain />
      <Elevator />
      <Escalator />
      <Information />
      <Parking />
      <Stairs />
      <Toilets />
    </g>
  )
}

export function MarkerAssets(): ReactNode {
  return <g className="markers"></g>
}

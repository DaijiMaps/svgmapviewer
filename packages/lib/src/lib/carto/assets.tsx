/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { symbolRenderMap } from './symbols/index'

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
      {Object.values(symbolRenderMap).map((render, idx) => (
        <Fragment key={idx}>{render()}</Fragment>
      ))}
    </g>
  )
}

export function MarkerAssets(): ReactNode {
  return <g className="markers"></g>
}

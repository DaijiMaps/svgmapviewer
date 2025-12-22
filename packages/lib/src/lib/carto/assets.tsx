/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { symbolRenderMap, type Kind } from './symbols/index'

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
      {Object.entries(symbolRenderMap).map(([id, render], idx) => (
        <Fragment key={idx}>{render({ id: id as Kind })}</Fragment>
      ))}
    </g>
  )
}

export function MarkerAssets(): ReactNode {
  return <g className="markers"></g>
}

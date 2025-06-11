/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { SvgSymbolStyle } from './Style'
import { svgMapViewerConfig } from './lib'
import { useLayoutSvgScaleS } from './lib/map-xstate'
import { useNames } from './lib/names'

export function MapSvgStyle(): ReactNode {
  const style = svgMapViewerConfig.mapSvgStyle

  return <style>{style}</style>
}

export function MapSvgSymbolsStyle(): ReactNode {
  return (
    <style>
      <SvgSymbolStyle />
    </style>
  )
}

export function MapSvgLabelsStyle(): ReactNode {
  const s = useLayoutSvgScaleS()
  const { sizes } = useNames()
  return (
    <style>
      {sizes.map((sz) => {
        // XXX
        // XXX
        // XXX
        const scale = Math.pow(2, sz) / 10 / 4
        const display = scale > s ? 'initial' : 'none'
        return `.size-${sz} { display: ${display}; }`
        // XXX
        // XXX
        // XXX
      })}
    </style>
  )
}

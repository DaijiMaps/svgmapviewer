/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { SvgSymbolStyle } from './Style'
import { svgMapViewerConfig } from './lib'

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
  return <style></style>
}

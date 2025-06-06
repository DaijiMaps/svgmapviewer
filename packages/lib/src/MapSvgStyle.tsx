/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { SvgSymbolStyle } from './Style'
import { svgMapViewerConfig } from './lib'

export function MapSvgStyle(): ReactNode {
  const style = svgMapViewerConfig.mapSvgStyle

  return (
    <style>
      <SvgSymbolStyle />
      {style}
    </style>
  )
}

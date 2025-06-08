/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type ReactNode, useEffect } from 'react'
import { renderShadowRoot } from './lib/dom'
import { MAP_SVG_ROOT_ID } from './lib/map-svg-react'
import { MapSvg } from './MapSvg'
import './MapSvgRoot.css'

export function MapSvgRoot(): ReactNode {
  useEffect(() => renderShadowRoot(MAP_SVG_ROOT_ID, <MapSvg />), [])

  return <div id={MAP_SVG_ROOT_ID} className="content svg" />
}

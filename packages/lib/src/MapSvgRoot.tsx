/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MAP_SVG_ROOT_ID } from './lib/map-svg-react'
import { MapSvg } from './MapSvg'
import './MapSvgRoot.css'

export function MapSvgRoot(): ReactNode {
  useMapSvgRoot()

  return <div id={MAP_SVG_ROOT_ID} className="content svg" />
}

function useMapSvgRoot(): void {
  useEffect(() => {
    const root = document.querySelector(`#${MAP_SVG_ROOT_ID}`)
    if (root === null || root.shadowRoot !== null) {
      return
    }
    const shadowRoot = root.attachShadow({ mode: 'open' })
    createRoot(shadowRoot).render(<MapSvg />)
  }, [])
}

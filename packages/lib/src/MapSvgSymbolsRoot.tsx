/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MAP_SVG_SYMBOLS_ROOT_ID } from './lib/map-svg-react'
import './MapSvgRoot.css'
import { MapSvgSymbols } from './MapSvgSymbols'

export function MapSvgSymbolsRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgSymbolsRoot()

  return (
    <div
      id="map-svg-symbols"
      className="content svg"
      style={{
        background: 'none',
      }}
    >
      <div id={MAP_SVG_SYMBOLS_ROOT_ID} />
    </div>
  )
}

// eslint-disable-next-line functional/no-return-void
function useMapSvgSymbolsRoot(): void {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    const root = document.querySelector(`#${MAP_SVG_SYMBOLS_ROOT_ID}`)
    if (root === null || root.shadowRoot !== null) {
      return
    }
    // shadowRoot is present

    const shadowRoot = root.attachShadow({ mode: 'open' })

    // eslint-disable-next-line functional/no-expression-statements
    createRoot(shadowRoot).render(<MapSvgSymbols />)
  }, [])
}

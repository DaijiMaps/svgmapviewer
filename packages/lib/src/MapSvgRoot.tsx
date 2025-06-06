/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ROOT_ID } from './lib/map-svg-react'
import { MapSvg } from './MapSvg'
import './MapSvg.css'

export function MapSvgRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgRoot()

  return (
    <div id="map-svg" className="content svg">
      <div id={ROOT_ID} />
    </div>
  )
}

// eslint-disable-next-line functional/no-return-void
function useMapSvgRoot(): void {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    const root = document.querySelector(`#${ROOT_ID}`)
    if (root === null || root.shadowRoot !== null) {
      return
    }
    // shadowRoot is present

    const shadowRoot = root.attachShadow({ mode: 'open' })

    // eslint-disable-next-line functional/no-expression-statements
    createRoot(shadowRoot).render(<MapSvg />)
  }, [])
}

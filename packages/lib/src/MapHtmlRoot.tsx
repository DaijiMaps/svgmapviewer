/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ROOT_ID } from './lib/map-html-react'
import { MapHtml } from './MapHtml'
import './MapHtml.css'

export function MapHtmlRoot(): ReactNode {
  useMapHtmlRoot()

  return <div id={ROOT_ID} className="content html" />
}

function useMapHtmlRoot(): void {
  useEffect(() => {
    const root = document.querySelector(`#${ROOT_ID}`)
    if (root === null || root.shadowRoot !== null) {
      return
    }
    const shadowRoot = root.attachShadow({ mode: 'open' })
    createRoot(shadowRoot).render(<MapHtml />)
  }, [])
}

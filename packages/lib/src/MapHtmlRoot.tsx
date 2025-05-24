import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ROOT_ID } from './lib/map-html-react'
import { MapHtml } from './MapHtml'
import './MapHtml.css'

export function MapHtmlRoot() {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    const root = document.querySelector(`#${ROOT_ID}`)
    if (root === null || root.shadowRoot !== null) {
      return
    }
    // shadowRoot is present

    const shadowRoot = root.attachShadow({ mode: 'open' })

    // eslint-disable-next-line functional/no-expression-statements
    createRoot(shadowRoot).render(<MapHtml />)
  }, [])

  return (
    <div className="content html">
      <div id={ROOT_ID} />
    </div>
  )
}

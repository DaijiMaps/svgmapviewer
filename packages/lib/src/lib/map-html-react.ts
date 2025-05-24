import { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MapHtml } from '../MapHtml'
import { renderCbs } from './map-html-xstate'
import { pointerActor } from './pointer-react'

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

export const ROOT_ID = 'map-html-content-root'

//// shadow DOM render

function renderMapHtmlRoot(children: Readonly<ReactNode>) {
  const root = document.querySelector(`#${ROOT_ID}`)
  if (root === null) {
    return
  }
  if (root.shadowRoot !== null) {
    // shadowRoot is present
    return
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  createRoot(shadowRoot).render(children)
}

renderCbs.add(() => renderMapHtmlRoot(MapHtml()))

export function useMapHtmlRendered() {
  useEffect(() => {
    pointerActor.send({ type: 'RENDERED.MAP-HTML' })
  }, [])
}

import { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { renderCbs, rootActor } from './map-html-xstate'
import { useNames } from './names'

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

export const ROOT_ID = 'map-html-content-root'

export function useMapHtmlRoot() {
  const { pointNames, areaNames } = useNames()

  useEffect(() => mountMapHtmlRoot(ROOT_ID), [])

  useEffect(
    () => rootActor.send({ type: 'UPDATE', pointNames, areaNames }),
    [pointNames, areaNames]
  )
}

function mountMapHtmlRoot(id: string) {
  const root = document.querySelector(`#${id}`)
  if (root === null || root.shadowRoot !== null) {
    return
  }
  // shadowRoot is present

  rootActor.send({ type: 'MOUNT' })
}

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

renderCbs.add(renderMapHtmlRoot)

import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { uiRootActor, uiRootRenderCbs } from './ui-root-xstate'

export function useUiRoot() {
  useEffect(() => mountUiRoot(), [])
}

function mountUiRoot() {
  uiRootActor.send({ type: 'MOUNT' })
}

function renderUiRoot(children: Readonly<ReactNode>) {
  const root = document.querySelector(`#ui-root`)
  if (root === null) {
    return
  }
  if (root.shadowRoot !== null) {
    return
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  createRoot(shadowRoot).render(children)
}

uiRootRenderCbs.add(renderUiRoot)

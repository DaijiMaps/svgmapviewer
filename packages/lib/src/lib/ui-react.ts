import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { uiRootActor, uiRootRenderCbs } from './ui-root-xstate'

export function useUiRoot(): void {
  useEffect(() => mountUiRoot(), [])
}

function mountUiRoot(): void {
  uiRootActor.send({ type: 'MOUNT' })
}

function renderUiRoot(children: Readonly<ReactNode>): void {
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

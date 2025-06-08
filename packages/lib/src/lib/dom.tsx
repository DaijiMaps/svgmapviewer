import { type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

// eslint-disable-next-line functional/no-return-void
export function mountShadowRoot(id: string): void {
  const root = document.querySelector(`#${id}`)
  if (root === null || root.shadowRoot === null) {
    return
  }

  //rootActor.send({ type: 'MOUNT', ref })
}

//// shadow DOM render

export function renderShadowRoot(
  id: string,
  children: Readonly<ReactNode>
  // eslint-disable-next-line functional/no-return-void
): void {
  const root = document.querySelector(`#${id}`)
  if (root === null || root.shadowRoot !== null) {
    return
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  // eslint-disable-next-line functional/no-expression-statements
  createRoot(shadowRoot).render(children)
}

export function isShadowRootRendered(id: string): boolean {
  return (document.querySelector(`#${id}`)?.shadowRoot ?? null) !== null
}

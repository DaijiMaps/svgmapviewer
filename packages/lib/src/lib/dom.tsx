import { type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

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
  const l =
    document.querySelector(`#${id}`)?.shadowRoot?.children?.length ?? null
  return l !== null && l > 0
}

export function queryShadowRoot(
  rootId: string,
  id: string
): null | HTMLElement | SVGElement {
  return (
    document.querySelector(`#${rootId}`)?.shadowRoot?.querySelector(`#${id}`) ??
    null
  )
}

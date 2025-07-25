import { useEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

export const shadowRootMap: Map<string, ShadowRoot> = new Map()

export function useShadowRoot(
  id: string,
  root: Readonly<ReactNode>,
  parent?: string
  // eslint-disable-next-line functional/no-return-void
): void {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => renderShadowRoot(id, root, parent), [id, parent, root])
}

function renderShadowRoot(
  id: string,
  children: Readonly<ReactNode>,
  parentId?: string
  // eslint-disable-next-line functional/no-return-void
): void {
  const parent =
    parentId === undefined ? document : (shadowRootMap.get(parentId) ?? null)
  if (parent === null) {
    return
  }
  const root = parent.querySelector(`#${id}`) ?? null
  if (root === null || root.shadowRoot !== null) {
    return
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
  shadowRootMap.set(id, shadowRoot)
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

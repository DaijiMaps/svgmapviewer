/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import { useStyleRef } from '../../style/ref'
import { tag } from '../../style/tag'
import type { VecVec } from '../../vec/prefixed'

const zoomSyncStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()

export function useZoomSyncStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(zoomSyncStyleRefs, ref, name)
}

export function updateZoomSyncStyleRefs(
  o: null | VecVec,
  zoom: null | number
): void {
  Array.from(zoomSyncStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--zoom-sync-origin`, o === null ? null : `${o.x}px ${o.y}px`)
    p(`--zoom-sync-transform`, zoom === null ? null : `scale(${zoom})`)
    tag(e, 'syncing', zoom !== null)
  })
}

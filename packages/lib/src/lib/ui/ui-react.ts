import type { RefCallback } from 'react'

import { shadowRootMap } from '../dom'
import type { OpenClose } from './openclose'
import type {
  UiDetailContent,
  UiDetailPart,
  UiHeaderPart,
  UiPart,
} from './ui-types'
import { useUiContext } from './ui-xstate'

export const UI_ROOT_ID = 'ui'

////

type UiRef<T> = (
  node: Readonly<null | HTMLDivElement>
) => ReturnType<RefCallback<T>>

type UiOpenCloseCb = (oc: OpenClose) => void
export const uiHeaderOpenCloseCbMap: Map<UiHeaderPart, UiOpenCloseCb> =
  new Map()
export const uiDetailOpenCloseCbMap: Map<UiDetailPart, UiOpenCloseCb> =
  new Map()

export function uiOpenCloseCb(part: UiPart, oc: OpenClose): void {
  const m = part === 'header' ? uiHeaderOpenCloseCbMap : uiDetailOpenCloseCbMap
  Array.from(m.values()).forEach((cb) => cb(oc))
}

export function uiRegisterHeaderCb<T>(
  name: UiHeaderPart,
  nodeCb: (node: HTMLDivElement) => UiOpenCloseCb
): UiRef<T> {
  function uiRef<T>(
    node: Readonly<null | HTMLDivElement>
  ): ReturnType<UiRef<T>> {
    if (node) uiHeaderOpenCloseCbMap.set(name, nodeCb(node))
    return () => {
      uiHeaderOpenCloseCbMap.delete(name)
    }
  }
  return uiRef
}

////

// XXX
export function resetDetailScroll(): void {
  shadowRootMap.get('detail')?.querySelector('.detail')?.scroll(0, 0)
}

////

export function useOpenCloseAll(): OpenClose {
  return useUiContext().all
}

export function useDetail(): UiDetailContent {
  return useUiContext().detail
}

export function useOpenCloseHeader(): OpenClose {
  return useUiContext().m['header']
}

export function useOpenCloseDetail(): OpenClose {
  return useUiContext().m['detail']
}

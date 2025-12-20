import { shadowRootMap } from '../dom'
import type { OpenClose } from './openclose'
import type { UiDetailContent } from './ui-types'
import { useUiContext } from './ui-xstate'

export const UI_ROOT_ID = 'ui'

// XXX
export function resetDetailScroll(): void {
  const root = shadowRootMap.get('detail')
  if (root === undefined) {
    return
  }
  const e = root.querySelector('.detail')
  if (e === null) {
    return
  }
  e.scroll(0, 0)
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

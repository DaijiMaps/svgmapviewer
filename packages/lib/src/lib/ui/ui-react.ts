import { useEffect, type RefObject } from 'react'

import { shadowRootMap } from '../dom'
import type { OpenClose } from './openclose'
import type { UiDetailContent } from './ui-types'
import { useUiContext } from './ui-xstate'

export const UI_ROOT_ID = 'ui'

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

export function useOpenCloseHeaderStyle(
  ref: Readonly<RefObject<HTMLDivElement | null>>
): void {
  const { open, animating } = useUiContext().m['header']

  useEffect(() => {
    if (ref.current === null) return
    ref.current.classList.remove(animating ? 'not-animating' : 'animating')
    ref.current.classList.add(!animating ? 'not-animating' : 'animating')
    ref.current.classList.remove(open ? 'closed' : `opened`)
    ref.current.classList.add(!open ? 'closed' : `opened`)
  }, [animating, open, ref])
}

export function useOpenCloseDetail(): OpenClose {
  return useUiContext().m['detail']
}

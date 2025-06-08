import { useEffect } from 'react'
import { viewerSend } from './viewer-xstate'

export const UI_ROOT_ID = 'ui'

let uiRendered = false

export function useUiRendered(): void {
  useEffect(() => {
    if (!uiRendered) {
      uiRendered = true
      viewerSend({ type: 'RENDERED.UI' })
    }
  }, [])
}

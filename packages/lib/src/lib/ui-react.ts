import { useEffect } from 'react'
import { viewerSend } from './viewer-xstate'

export const UI_ROOT_ID = 'ui-root'
export const UI_CONTENT_ID = 'ui-content'

let uiRendered = false

export function useUiRendered(): void {
  useEffect(() => {
    if (!uiRendered) {
      uiRendered = true
      viewerSend({ type: 'RENDERED.UI' })
    }
  }, [])
}

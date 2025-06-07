import { useEffect } from 'react'
import { viewerSend } from './viewer-xstate'

export const ROOT_ID = 'map-html-root'

let mapHtmlRendered = false

export function useMapHtmlRendered(): void {
  useEffect(() => {
    if (!mapHtmlRendered) {
      mapHtmlRendered = true
      viewerSend({ type: 'RENDERED.MAP-HTML' })
    }
  }, [])
}

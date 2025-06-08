import { useEffect } from 'react'
import { viewerSend } from './viewer-xstate'

export const MAP_HTML_ROOT_ID = 'map-html'

let mapHtmlRendered = false

export function useMapHtmlRendered(): void {
  useEffect(() => {
    if (!mapHtmlRendered) {
      mapHtmlRendered = true
      viewerSend({ type: 'RENDERED.MAP-HTML' })
    }
  }, [])
}

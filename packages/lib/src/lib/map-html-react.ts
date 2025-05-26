import { useEffect } from 'react'
import { pointerSend } from './pointer-xstate'

export const ROOT_ID = 'map-html-content-root'

let mapHtmlRendered = false

export function useMapHtmlRendered(): void {
  useEffect(() => {
    if (!mapHtmlRendered) {
      mapHtmlRendered = true
      pointerSend({ type: 'RENDERED.MAP-HTML' })
    }
  }, [])
}

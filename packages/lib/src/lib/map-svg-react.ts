import { useEffect } from 'react'
import { viewerSend } from './viewer-xstate'

export const ROOT_ID = 'map-svg-content-root'

let mapSvgRendered = false

export function useMapSvgRendered(): void {
  useEffect(() => {
    if (!mapSvgRendered) {
      mapSvgRendered = true
      viewerSend({ type: 'RENDERED.MAP-SVG' })
    }
  }, [])
}

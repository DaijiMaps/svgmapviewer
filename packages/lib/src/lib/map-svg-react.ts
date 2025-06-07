import { useEffect } from 'react'
import { viewerSend } from './viewer-xstate'

export const MAP_SVG_ROOT_ID = 'map-svg-root'
export const MAP_SVG_CONTENT_ID = 'map-svg-svg'
export const MAP_SVG_SYMBOLS_ROOT_ID = 'map-svg-symbols-root'
export const MAP_SVG_SYMBOLS_CONTENT_ID = 'map-svg-symbols-svg'

let mapSvgRendered = false
let mapSvgSymbolsRendered = false

export function useMapSvgRendered(): void {
  useEffect(() => {
    if (!mapSvgRendered) {
      mapSvgRendered = true
      viewerSend({ type: 'RENDERED.MAP-SVG' })
    }
  }, [])
}

export function useMapSvgSymbolsRendered(): void {
  useEffect(() => {
    if (!mapSvgSymbolsRendered) {
      mapSvgSymbolsRendered = true
      viewerSend({ type: 'RENDERED.MAP-SVG-SYMBOLS' })
    }
  }, [])
}

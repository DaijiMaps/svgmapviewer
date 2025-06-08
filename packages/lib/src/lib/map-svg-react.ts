import { registerCbs } from './config-xstate'
import { syncViewBox } from './svg'

export const MAP_SVG_ROOT_ID = 'map-svg'
export const MAP_SVG_CONTENT_ID = 'map-svg-svg'
export const MAP_SVG_SYMBOLS_ROOT_ID = 'map-svg-symbols'
export const MAP_SVG_SYMBOLS_CONTENT_ID = 'map-svg-symbols-svg'

registerCbs({
  layoutCb: (layout) => {
    syncViewBox(MAP_SVG_ROOT_ID, MAP_SVG_CONTENT_ID, layout.svg)
    syncViewBox(MAP_SVG_SYMBOLS_ROOT_ID, MAP_SVG_SYMBOLS_CONTENT_ID, layout.svg)
  },
})

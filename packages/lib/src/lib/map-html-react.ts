import { useEffect } from 'react'
import { pointerActor } from './pointer-react'

export const ROOT_ID = 'map-html-content-root'

let mapHtmlRendered = false

export function useMapHtmlRendered() {
  useEffect(() => {
    if (!mapHtmlRendered) {
      mapHtmlRendered = true
      pointerActor.send({ type: 'RENDERED.MAP-HTML' })
    }
  }, [])
}

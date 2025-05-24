import { useEffect } from 'react'
import { pointerActor } from './pointer-react'

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

export const ROOT_ID = 'map-html-content-root'

//// shadow DOM render

export function useMapHtmlRendered() {
  useEffect(() => {
    pointerActor.send({ type: 'RENDERED.MAP-HTML' })
  }, [])
}

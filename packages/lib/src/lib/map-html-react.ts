import { useEffect } from 'react'
import { pointerActor } from './pointer-react'

export const ROOT_ID = 'map-html-content-root'

export function useMapHtmlRendered() {
  useEffect(() => {
    pointerActor.send({ type: 'RENDERED.MAP-HTML' })
  }, [])
}

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, type RefObject } from 'react'

import { getZooming } from '../layout/animation'

function handleTouchMove(ev: Readonly<TouchEvent>) {
  if (getZooming()) {
    ev.preventDefault()
  }
}

export function useTouchMoveZoomingLock(
  ref: Readonly<RefObject<HTMLDivElement | null>>
): void {
  useEffect(() => {
    const e = ref.current
    if (e) e.addEventListener('touchmove', handleTouchMove)
    return () => {
      if (e) e.removeEventListener('touchmove', handleTouchMove)
    }
  }, [ref])
}

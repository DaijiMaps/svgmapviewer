/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */

// XXX
// XXX
// XXX - prevent wheel events from propagating
// XXX - if detail content is short & is NOT scrollable, overscroll-behavior does NOT work
// XXX - we cannot make container unscrollable, because it is VERY expensive
// XXX
// XXX

import { useEffect, useRef, type RefObject } from 'react'

import { wheeleventmask } from './viewer/viewer-xstate'

export function useOnWheel(): RefObject<null | HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const e = ref.current
    if (!e) {
      return
    }
    e.addEventListener('wheel', onwheel)
    return () => {
      e.removeEventListener('wheel', onwheel)
    }
  }, [ref])

  return ref
}

function onwheel(ev: Readonly<WheelEvent | React.WheelEvent>): void {
  const e = ev.currentTarget
  if (
    wheeleventmask &&
    e instanceof HTMLDivElement &&
    e.scrollWidth === e.clientWidth &&
    e.scrollHeight === e.clientHeight
  ) {
    ev.preventDefault()
  }
}

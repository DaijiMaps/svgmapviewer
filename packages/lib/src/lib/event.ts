/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements*/
/* eslint-disable functional/no-return-void*/

import { useRef } from 'react'

type EventHandler = (ev: Readonly<Event>) => void

export function useEventRateLimit(
  cb: (ev: Readonly<Event>) => void,
  n: number,
  dur: number
): EventHandler {
  const timeStamp = useRef(0)
  const count = useRef(0)

  return (ev: Readonly<Event>) => {
    if (ev.timeStamp - timeStamp.current < dur) {
      count.current = 0
      return
    }
    count.current = count.current + 1
    if (count.current < n) {
      return
    }
    timeStamp.current = ev.timeStamp
    count.current = 0
    cb(ev)
  }
}

/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements*/
/* eslint-disable functional/no-return-void*/

import { useCallback, useRef } from 'react'

// XXX Event -> T extends <{ timeStamp: number}>

type WithTimeStamp = { timeStamp: number }

type EventHandler<T> = (ev: Readonly<T>) => void

export function useEventRateLimit<T extends WithTimeStamp>(
  cb: (ev: Readonly<T>) => void,
  n: number,
  dur: number
): EventHandler<T> {
  const timeStamp = useRef(0)
  const count = useRef(0)

  const f = useCallback(
    (ev: Readonly<T>) => {
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
    },
    [cb, dur, n]
  )

  return f
}

export function useEventTimeout<T>(
  cb: (ev: Readonly<T>) => void,
  timo: number,
  entry?: () => boolean
): EventHandler<T> {
  const timer = useRef<null | number>(null)
  const f = useCallback(
    (ev: Readonly<T>) => {
      if (entry !== undefined && entry()) {
        return
      }
      if (timer.current !== null) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
      timer.current = window.setTimeout(() => {
        cb(ev)
        if (timer.current !== null) {
          window.clearTimeout(timer.current)
          timer.current = null
        }
      }, timo)
    },
    [cb, entry, timo]
  )
  return f
}

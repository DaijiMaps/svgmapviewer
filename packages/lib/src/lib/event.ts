/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements*/
/* eslint-disable functional/no-return-void*/

import { useCallback, useRef } from 'react'

// XXX Event -> T extends <{ timeStamp: number}>

type WithTimeStamp = { timeStamp: number }

type Handler<T> = (ev: Readonly<T>) => void

export function useRateLimit<T extends WithTimeStamp>(
  cb: (ev: Readonly<T>) => void,
  dur: number,
  n: number
): Handler<T> {
  const timeStamp = useRef(0)
  const count = useRef(0)

  const f = useCallback(
    (ev: Readonly<T>) => {
      if (ev.timeStamp - timeStamp.current < dur) {
        timeStamp.current = ev.timeStamp
        count.current = 0
        return
      }
      count.current = count.current + 1
      if (count.current < n) {
        return
      }
      cb(ev)
      timeStamp.current = ev.timeStamp
      count.current = 0
    },
    [cb, dur, n]
  )

  return f
}

export function useTimeout<T>(
  cb: (ev: Readonly<T>) => void,
  timo: number,
  entry?: () => boolean
): Handler<T> {
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

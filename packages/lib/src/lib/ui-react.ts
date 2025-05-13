import { useActorRef } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { SearchRes } from './types'
import { uiMachine, UiRef } from './ui-xstate'

export function useUi(): {
  uiRef: UiRef
} {
  const uiRef = useActorRef(uiMachine)

  const uiDetail = useCallback(
    (res: Readonly<null | SearchRes>) => {
      if (res !== null) {
        uiRef.send({ type: 'DETAIL', ...res })
      }
    },
    [uiRef]
  )
  useEffect(() => {
    cfg.searchEndCbs.add(uiDetail)
    return () => {
      cfg.searchEndCbs.delete(uiDetail)
    }
  }, [uiDetail])

  const uiOpen = useCallback(
    (ok: boolean) => uiRef.send({ type: ok ? 'OPEN' : 'CANCEL' }),
    [uiRef]
  )
  useEffect(() => {
    cfg.uiOpenDoneCbs.add(uiOpen)
    return () => {
      cfg.uiOpenDoneCbs.delete(uiOpen)
    }
  }, [uiOpen])

  const uiCancel = useCallback(() => uiRef.send({ type: 'CANCEL' }), [uiRef])
  useEffect(() => {
    cfg.uiCloseCbs.add(uiCancel)
    return () => {
      cfg.uiCloseCbs.delete(uiCancel)
    }
  }, [uiCancel])

  useEffect(() => {
    const closeDone = uiRef.on('CLOSE.DONE', () =>
      cfg.uiCloseDoneCbs.forEach((cb) => cb())
    )
    return () => {
      closeDone.unsubscribe()
    }
  }, [uiRef])

  return { uiRef }
}

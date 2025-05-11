import { useMachine } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { SearchRes } from './types'
import { uiMachine, UiRef, UiSend, UiState } from './ui-xstate'

export function useUi(): {
  ui: UiState
  uiSend: UiSend
  uiRef: UiRef
} {
  const [ui, uiSend, uiRef] = useMachine(uiMachine)

  const uiDetail = useCallback(
    (res: Readonly<null | SearchRes>) => {
      if (res !== null) {
        uiSend({ type: 'DETAIL', ...res })
      }
    },
    [uiSend]
  )
  useEffect(() => {
    cfg.searchEndCbs.add(uiDetail)
    return () => {
      cfg.searchEndCbs.delete(uiDetail)
    }
  }, [uiDetail])

  const uiOpen = useCallback(
    (ok: boolean) => uiSend({ type: ok ? 'OPEN' : 'CANCEL' }),
    [uiSend]
  )
  useEffect(() => {
    cfg.uiOpenDoneCbs.add(uiOpen)
    return () => {
      cfg.uiOpenDoneCbs.delete(uiOpen)
    }
  }, [uiOpen])

  const uiCancel = useCallback(() => uiSend({ type: 'CANCEL' }), [uiSend])
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

  return { ui, uiSend, uiRef }
}

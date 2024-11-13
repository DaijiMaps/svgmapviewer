import { useMachine, useSelector } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { diag } from './diag'
import { PointerRef, selectLayout } from './pointer-xstate'
import { SearchRes } from './types'
import { uiMachine, UiRef, UiSend, UiState } from './ui-xstate'

export function useUi(pointerRef: PointerRef): {
  ui: UiState
  uiSend: UiSend
  uiRef: UiRef
} {
  const [ui, uiSend, uiRef] = useMachine(uiMachine)

  const layout = useSelector(pointerRef, selectLayout)

  const uiDetail = useCallback(
    (res: Readonly<null | SearchRes>) => {
      if (res !== null) {
        const dir = diag(layout.container, res.p)
        uiSend({ type: 'DETAIL', ...res, dir })
      }
    },
    [layout.container, uiSend]
  )
  const uiOpen = useCallback(
    (ok: boolean) => uiSend({ type: ok ? 'OPEN' : 'CANCEL' }),
    [uiSend]
  )
  const uiCancel = useCallback(() => uiSend({ type: 'CANCEL' }), [uiSend])

  useEffect(() => {
    cfg.searchEndCbs.add(uiDetail)
    cfg.uiOpenDoneCbs.add(uiOpen)
    cfg.uiCloseCbs.add(uiCancel)
    return () => {
      cfg.searchEndCbs.delete(uiDetail)
      cfg.uiOpenDoneCbs.delete(uiOpen)
      cfg.uiCloseCbs.delete(uiCancel)
    }
  }, [uiCancel, uiDetail, uiOpen])

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

import { useMachine, useSelector } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { svgMapViewerConfig } from './config'
import { diag } from './diag'
import { selectLayout } from './pointer-react'
import { PointerRef } from './pointer-xstate'
import { SearchRes } from './types'
import { uiMachine, UiRef, UiSend, UiState } from './ui-xstate'

export const selectDetail = (ui: UiState) => ui.context.detail
export const selectOpenCloseHeader = (ui: UiState) => ui.context.m['header']
export const selectOpenCloseFooter = (ui: UiState) => ui.context.m['footer']
export const selectOpenCloseShadow = (ui: UiState) => ui.context.m['shadow']
export const selectOpenCloseBalloon = (ui: UiState) => ui.context.m['balloon']
export const selectOpenCloseDetail = (ui: UiState) => ui.context.m['detail']

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
    svgMapViewerConfig.searchEndCbs.add(uiDetail)
    svgMapViewerConfig.uiOpenDoneCbs.add(uiOpen)
    svgMapViewerConfig.uiCloseCbs.add(uiCancel)
    return () => {
      svgMapViewerConfig.searchEndCbs.delete(uiDetail)
      svgMapViewerConfig.uiOpenDoneCbs.delete(uiOpen)
      svgMapViewerConfig.uiCloseCbs.delete(uiCancel)
    }
  }, [uiCancel, uiDetail, uiOpen])

  useEffect(() => {
    const closeDone = uiRef.on('CLOSE.DONE', () =>
      svgMapViewerConfig.uiCloseDoneCbs.forEach((cb) => cb())
    )
    return () => {
      closeDone.unsubscribe()
    }
  }, [uiRef])

  return { ui, uiSend, uiRef }
}

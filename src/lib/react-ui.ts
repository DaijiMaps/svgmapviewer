import { useMachine, useSelector } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import { svgMapViewerConfig } from './config'
import { diag } from './diag'
import { selectLayout } from './react-pointer'
import { SearchRes } from './types'
import { PointerRef } from './xstate-pointer'
import { uiMachine, UiState } from './xstate-ui'

export const selectDetail = (ui: UiState) => ui.context.detail
export const selectBalloon = (ui: UiState) => ui.context.m['balloon']
export const selectShadow = (ui: UiState) => ui.context.m['shadow']

export function useUi(pointerRef: PointerRef) {
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
    svgMapViewerConfig.searchEndCbs.push(uiDetail)
    svgMapViewerConfig.uiOpenDoneCbs.push(uiOpen)
    svgMapViewerConfig.uiCloseCbs.push(uiCancel)
    return () => {
      svgMapViewerConfig.searchEndCbs = svgMapViewerConfig.searchEndCbs.filter(
        (cb) => cb !== uiDetail
      )
      svgMapViewerConfig.uiOpenDoneCbs =
        svgMapViewerConfig.uiOpenDoneCbs.filter((cb) => cb !== uiOpen)
      svgMapViewerConfig.uiCloseCbs = svgMapViewerConfig.uiCloseCbs.filter(
        (cb) => cb !== uiCancel
      )
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

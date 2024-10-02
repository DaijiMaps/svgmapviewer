import { useMachine, useSelector } from '@xstate/react'
import { RefObject, useCallback, useContext, useEffect } from 'react'
import { SvgMapViewerConfigContext } from '../svgmapviewer'
import { svgMapViewerConfig } from './config'
import { configLayout } from './layout'
import {
  pointerMachine,
  PointerRef,
  PointerSend,
  PointerState,
  ReactPointerEvent,
  selectMode,
} from './pointer-xstate'
import { useWindowResize } from './resize-react'
import { Vec } from './vec'

let pointereventmask: boolean = false
let toucheventmask: boolean = false
let wheeleventmask: boolean = false
let clickeventmask: boolean = false

function usePointerKey(send: PointerSend) {
  const keyDown = useCallback(
    (ev: KeyboardEvent) => send({ type: 'KEY.DOWN', ev }),
    [send]
  )
  const keyUp = useCallback(
    (ev: KeyboardEvent) => send({ type: 'KEY.UP', ev }),
    [send]
  )

  useEffect(() => {
    const add = document.body.addEventListener
    const remove = document.body.removeEventListener
    add('keydown', keyDown)
    add('keyup', keyUp)
    return () => {
      remove('keydown', keyDown)
      remove('keyup', keyUp)
    }
  }, [keyDown, keyUp, send])
}

function usePointerEvent(
  containerRef: RefObject<HTMLDivElement>,
  pointerSend: PointerSend
) {
  const send = useCallback(
    (
      event: ReactPointerEvent,
      options?: {
        preventDefault?: boolean
        stopPropagation?: boolean
      }
    ) => {
      if (options?.preventDefault === false) {
        // skip
      } else {
        event.ev.preventDefault()
      }
      if (options?.stopPropagation === false) {
        // skip
      } else {
        event.ev.stopPropagation()
      }
      pointerSend(event)
    },
    [pointerSend]
  )

  const sendPointerDown = useCallback(
    (ev: PointerEvent) => send({ type: 'POINTER.DOWN', ev }),
    [send]
  )
  const sendPointerMove = useCallback(
    (ev: PointerEvent) => send({ type: 'POINTER.MOVE', ev }),
    [send]
  )
  const sendPointerUp = useCallback(
    (ev: PointerEvent) => {
      if (pointereventmask) {
        return
      }
      send({ type: 'POINTER.UP', ev })
    },
    [send]
  )
  const sendTouchStart = useCallback(
    (ev: TouchEvent) => {
      if (toucheventmask) {
        return
      }
      // skip preventDefault to enable emulated "click"
      send({ type: 'TOUCH.START', ev }, { preventDefault: false })
    },
    [send]
  )
  const sendTouchMove = useCallback(
    (ev: TouchEvent) => {
      if (toucheventmask) {
        return
      }
      send({ type: 'TOUCH.MOVE', ev })
    },
    [send]
  )
  const sendTouchEnd = useCallback(
    (ev: TouchEvent) => {
      if (toucheventmask) {
        return
      }
      // skip preventDefault to enable emulated "click"
      send({ type: 'TOUCH.END', ev }, { preventDefault: false })
    },
    [send]
  )
  const sendClick = useCallback(
    (ev: MouseEvent) => {
      if (clickeventmask) {
        return
      }
      send({ type: 'CLICK', ev })
    },
    [send]
  )
  const sendContextMenuu = useCallback(
    (ev: MouseEvent) => send({ type: 'CONTEXTMENU', ev }),
    [send]
  )
  const sendWheel = useCallback(
    (ev: WheelEvent) => {
      if (wheeleventmask) {
        return
      }
      send({ type: 'WHEEL', ev })
    },
    [send]
  )
  const sendScroll = useCallback(
    (ev: Event) => {
      send({ type: 'SCROLL', ev })
    },
    [send]
  )

  useEffect(() => {
    const e = containerRef.current
    if (e === null) {
      return
    }
    e.addEventListener('pointerdown', sendPointerDown)
    e.addEventListener('pointermove', sendPointerMove)
    e.addEventListener('pointerup', sendPointerUp)
    e.addEventListener('touchstart', sendTouchStart)
    e.addEventListener('touchmove', sendTouchMove)
    e.addEventListener('touchend', sendTouchEnd)
    e.addEventListener('click', sendClick)
    e.addEventListener('contextmenu', sendContextMenuu)
    e.addEventListener('wheel', sendWheel)
    e.addEventListener('scroll', sendScroll)
    return () => {
      e.removeEventListener('pointerdown', sendPointerDown)
      e.removeEventListener('pointermove', sendPointerMove)
      e.removeEventListener('pointerup', sendPointerUp)
      e.removeEventListener('touchstart', sendTouchStart)
      e.removeEventListener('touchmove', sendTouchMove)
      e.removeEventListener('touchend', sendTouchEnd)
      e.removeEventListener('click', sendClick)
      e.removeEventListener('contextmenu', sendContextMenuu)
      e.removeEventListener('wheel', sendWheel)
      e.removeEventListener('scroll', sendScroll)
    }
  }, [
    containerRef,
    sendClick,
    sendContextMenuu,
    sendPointerDown,
    sendPointerMove,
    sendPointerUp,
    sendScroll,
    sendTouchEnd,
    sendTouchMove,
    sendTouchStart,
    sendWheel,
  ])
}

export function usePointer(containerRef: RefObject<HTMLDivElement>): {
  pointer: PointerState
  pointerSend: PointerSend
  pointerRef: PointerRef
} {
  const body = useWindowResize()
  const config = useContext(SvgMapViewerConfigContext)

  const [pointer, pointerSend, pointerRef] = useMachine(pointerMachine, {
    input: { containerRef },
  })

  ////
  //// event handlers
  ////

  usePointerKey(pointerSend)

  usePointerEvent(containerRef, pointerSend)

  const mode = useSelector(pointerRef, selectMode)

  useEffect(() => {
    const e = containerRef.current
    if (e === null) {
      return
    }
    pointereventmask = mode !== 'pointing'
    toucheventmask = mode !== 'pointing'
    wheeleventmask = mode !== 'pointing'
    // - xstate-pointer receives 'click' to cancel 'panning'
    // - xstate-pointer ignores 'click' to pass throughh (emulated)
    //  'click' to shadow; shadow receives 'click' to cancel 'locked'
    clickeventmask = mode === 'locked'
  }, [containerRef, mode])

  ////
  //// ui callbacks
  ////

  const pointerSearchLock = useCallback(
    (p: Vec, psvg: Vec) => pointerSend({ type: 'SEARCH.LOCK', p, psvg }),
    [pointerSend]
  )
  const pointerSearchUnlock = useCallback(
    () => pointerSend({ type: 'SEARCH.UNLOCK' }),
    [pointerSend]
  )

  useEffect(() => {
    svgMapViewerConfig.uiOpenCbs.add(pointerSearchLock)
    svgMapViewerConfig.uiCloseDoneCbs.add(pointerSearchUnlock)
    return () => {
      svgMapViewerConfig.uiOpenCbs.delete(pointerSearchLock)
      svgMapViewerConfig.uiCloseDoneCbs.delete(pointerSearchUnlock)
    }
  }, [pointerSearchLock, pointerSearchUnlock])

  useEffect(() => {
    const search = pointerRef.on('SEARCH', ({ p, psvg }) =>
      svgMapViewerConfig.searchStartCbs.forEach((cb) => cb(p, psvg))
    )
    const lock = pointerRef.on('LOCK', ({ ok }) =>
      svgMapViewerConfig.uiOpenDoneCbs.forEach((cb) => cb(ok))
    )
    return () => {
      search.unsubscribe()
      lock.unsubscribe()
    }
  }, [pointerRef])

  ////
  //// actions
  ////

  useEffect(() => {
    const style = getComputedStyle(document.body)

    pointerSend({
      type: 'LAYOUT',
      config: configLayout(
        parseFloat(style.fontSize),
        config.origViewBox,
        body
      ),
    })
  }, [body, config.origViewBox, pointerSend])

  useEffect(() => {
    if (pointer.hasTag('rendering')) {
      pointerSend({ type: 'RENDERED' })
    }
  }, [pointer, pointerSend])

  return {
    pointer,
    pointerSend,
    pointerRef,
  }
}

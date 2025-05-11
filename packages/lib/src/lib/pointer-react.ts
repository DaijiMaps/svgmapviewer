import { useActorRef, useSelector } from '@xstate/react'
import { RefObject, useCallback, useEffect } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { Layout } from './layout'
import { useLayout } from './layout-react'
import {
  pointerMachine,
  PointerRef,
  ReactUIEvent,
  selectExpanding,
  selectLayout,
  selectMode,
} from './pointer-xstate'
import { Vec } from './vec'

let pointereventmask: boolean = false
let toucheventmask: boolean = false
let clickeventmask: boolean = false
let wheeleventmask: boolean = false
let scrolleventmask: boolean = false

let scrollIdleTimer: null | number = null

function usePointerKey(pointerRef: PointerRef) {
  const keyDown = useCallback(
    (ev: KeyboardEvent) => pointerRef.send({ type: 'KEY.DOWN', ev }),
    [pointerRef]
  )
  const keyUp = useCallback(
    (ev: KeyboardEvent) => pointerRef.send({ type: 'KEY.UP', ev }),
    [pointerRef]
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
  }, [keyDown, keyUp])
}

function usePointerEvent(
  containerRef: RefObject<HTMLDivElement>,
  pointerRef: PointerRef
) {
  const send = useCallback(
    (
      // excluding key down/up events
      event: ReactUIEvent,
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
      pointerRef.send(event)
    },
    [pointerRef]
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
      if (scrollIdleTimer !== null) {
        window.clearTimeout(scrollIdleTimer)
      }
      if (scrolleventmask) {
        return
      }
      scrollIdleTimer = window.setTimeout(() => {
        if (!scrolleventmask) {
          send({ type: 'SCROLL', ev })
        }
        scrollIdleTimer = null
      }, cfg.scrollIdleTimeout)
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
  pointerRef: PointerRef
} {
  const pointerRef = useActorRef(pointerMachine, {
    input: { containerRef },
  })

  ////
  //// event handlers
  ////

  usePointerKey(pointerRef)

  usePointerEvent(containerRef, pointerRef)

  const layout = useSelector(pointerRef, selectLayout)
  const mode = useSelector(pointerRef, selectMode)

  useEffect(() => {
    const e = containerRef.current
    if (e === null) {
      return
    }
    pointereventmask = mode !== 'pointing'
    toucheventmask = mode !== 'pointing'
    // - xstate-pointer receives 'click' to cancel 'panning'
    // - xstate-pointer ignores 'click' to pass through (emulated)
    //  'click' to shadow; shadow receives 'click' to cancel 'locked'
    clickeventmask = mode === 'locked'
    wheeleventmask = mode !== 'pointing'
    scrolleventmask = mode !== 'panning'
  }, [containerRef, mode])

  ////
  //// ui callbacks
  ////

  const pointerSearchLock = useCallback(
    (p: Vec, psvg: Vec) => pointerRef.send({ type: 'SEARCH.LOCK', p, psvg }),
    [pointerRef]
  )
  const pointerSearchUnlock = useCallback(
    () => pointerRef.send({ type: 'SEARCH.UNLOCK' }),
    [pointerRef]
  )

  useEffect(() => {
    cfg.uiOpenCbs.add(pointerSearchLock)
    cfg.uiCloseDoneCbs.add(pointerSearchUnlock)
    return () => {
      cfg.uiOpenCbs.delete(pointerSearchLock)
      cfg.uiCloseDoneCbs.delete(pointerSearchUnlock)
    }
  }, [pointerSearchLock, pointerSearchUnlock])

  useEffect(() => {
    const subs = [
      pointerRef.on('SEARCH', ({ p, psvg }) =>
        cfg.searchStartCbs.forEach((cb) => cb(p, psvg))
      ),
      pointerRef.on('LOCK', ({ ok }) =>
        cfg.uiOpenDoneCbs.forEach((cb) => cb(ok))
      ),
      pointerRef.on('LAYOUT', ({ layout }) =>
        cfg.zoomEndCbs.forEach((cb) => cb(layout, 1))
      ),
      pointerRef.on('ZOOM.START', ({ layout, zoom, z }) =>
        cfg.zoomStartCbs.forEach((cb) => cb(layout, zoom, z))
      ),
      pointerRef.on('ZOOM.END', ({ layout, zoom }) =>
        cfg.zoomEndCbs.forEach((cb) => cb(layout, zoom))
      ),
    ]
    return () => subs.forEach((sub) => sub.unsubscribe())
  }, [pointerRef])

  ////
  //// actions
  ////

  const expanding = useSelector(pointerRef, selectExpanding)

  useEffect(() => {
    pointerRef.send({ type: 'RENDERED' })
  }, [expanding, pointerRef])

  useLayout((layout: Readonly<Layout>) => {
    pointerRef.send({ type: 'LAYOUT', layout })
  }, cfg.origViewBox)

  useEffect(() => {
    cfg.layout = layout
  }, [layout])

  return {
    pointerRef,
  }
}

import { useSelector } from '@xstate/react'
import React, { RefObject, useEffect } from 'react'
import { createActor } from 'xstate'
import { svgMapViewerConfig as cfg } from './config'
import { timeoutMachine } from './event-xstate'
import { Layout } from './layout'
import { useLayout } from './layout-react'
import {
  pointerMachine,
  PointerMode,
  ReactUIEvent,
  selectExpanding,
} from './pointer-xstate'
import { Vec } from './vec'

let pointereventmask: boolean = false
let toucheventmask: boolean = false
let clickeventmask: boolean = false
let wheeleventmask: boolean = false
let scrolleventmask: boolean = false

function reflectMode(mode: PointerMode): void {
  pointereventmask = mode !== 'pointing'
  toucheventmask = mode !== 'pointing'
  // - xstate-pointer receives 'click' to cancel 'panning'
  // - xstate-pointer ignores 'click' to pass through (emulated)
  //  'click' to shadow; shadow receives 'click' to cancel 'locked'
  clickeventmask = mode === 'locked'
  wheeleventmask = mode !== 'pointing'
  scrolleventmask = mode !== 'panning'
  if (mode === 'panning') {
    scrollTimeoutActor.send({ type: 'START' })
  } else {
    scrollTimeoutActor.send({ type: 'STOP' })
  }
}

function usePointerKey() {
  useEffect(() => {
    const add = document.body.addEventListener
    const remove = document.body.removeEventListener
    add('keydown', keyDown)
    add('keyup', keyUp)
    return () => {
      remove('keydown', keyDown)
      remove('keyup', keyUp)
    }
  }, [])
}

function usePointerEvent(containerRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const e = containerRef.current
    if (e === null) {
      return
    }
    //e.addEventListener('pointerdown', sendPointerDown)
    //e.addEventListener('pointermove', sendPointerMove)
    //e.addEventListener('pointerup', sendPointerUp)
    //e.addEventListener('touchstart', sendTouchStart)
    //e.addEventListener('touchmove', sendTouchMove)
    //e.addEventListener('touchend', sendTouchEnd)
    //e.addEventListener('click', sendClick)
    //e.addEventListener('contextmenu', sendContextMenu)
    //e.addEventListener('wheel', sendWheel)
    //e.addEventListener('scroll', sendScroll)
    return () => {
      //e.removeEventListener('pointerdown', sendPointerDown)
      //e.removeEventListener('pointermove', sendPointerMove)
      //e.removeEventListener('pointerup', sendPointerUp)
      //e.removeEventListener('touchstart', sendTouchStart)
      //e.removeEventListener('touchmove', sendTouchMove)
      //e.removeEventListener('touchend', sendTouchEnd)
      //e.removeEventListener('click', sendClick)
      //e.removeEventListener('contextmenu', sendContextMenu)
      //e.removeEventListener('wheel', sendWheel)
      //e.removeEventListener('scroll', sendScroll)
    }
  }, [containerRef])
}

// XXX
// XXX
// XXX
function useExpanding() {
  // re-render handling
  const expanding = useSelector(pointerActor, selectExpanding)
  useEffect(() => {
    pointerActor.send({ type: 'RENDERED' })
  }, [expanding])
}
// XXX
// XXX
// XXX

function useResizing() {
  // resize handling
  useLayout(layoutCb, cfg.origViewBox)
}

export function usePointer(containerRef: RefObject<HTMLDivElement>): void {
  //// event handlers
  usePointerKey()
  usePointerEvent(containerRef)

  //// actions
  useExpanding()
  useResizing()
}

////

export const pointerActor = createActor(pointerMachine, {
  systemId: 'system-pointer1',
})
pointerActor.on('SEARCH', ({ psvg }) =>
  cfg.searchStartCbs.forEach((cb) => cb(psvg))
)
pointerActor.on('LOCK', ({ ok }) => cfg.uiOpenDoneCbs.forEach((cb) => cb(ok)))
pointerActor.on('LAYOUT', ({ layout }) =>
  cfg.zoomEndCbs.forEach((cb) => cb(layout, 1))
)
pointerActor.on('ZOOM.START', ({ layout, zoom, z }) =>
  cfg.zoomStartCbs.forEach((cb) => cb(layout, zoom, z))
)
pointerActor.on('ZOOM.END', ({ layout, zoom }) =>
  cfg.zoomEndCbs.forEach((cb) => cb(layout, zoom))
)
pointerActor.on('MODE', ({ mode }) => reflectMode(mode))
pointerActor.start()

const pointerSend = (
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
  pointerActor.send(event)
}

export const sendPointerDown = (ev: PointerEvent | React.PointerEvent) =>
  pointerSend({ type: 'POINTER.DOWN', ev })
export const sendPointerMove = (ev: PointerEvent | React.PointerEvent) =>
  pointerSend({ type: 'POINTER.MOVE', ev })
export const sendPointerUp = (ev: PointerEvent | React.PointerEvent) => {
  if (pointereventmask) {
    return
  }
  pointerSend({ type: 'POINTER.UP', ev })
}
export const sendTouchStart = (ev: TouchEvent | React.TouchEvent) => {
  if (toucheventmask) {
    return
  }
  // skip preventDefault to enable emulated "click"
  pointerSend({ type: 'TOUCH.START', ev }, { preventDefault: false })
}
export const sendTouchMove = (ev: TouchEvent | React.TouchEvent) => {
  if (toucheventmask) {
    return
  }
  pointerSend({ type: 'TOUCH.MOVE', ev })
}
export const sendTouchEnd = (ev: TouchEvent | React.TouchEvent) => {
  if (toucheventmask) {
    return
  }
  // skip preventDefault to enable emulated "click"
  pointerSend({ type: 'TOUCH.END', ev }, { preventDefault: false })
}
export const sendClick = (ev: MouseEvent | React.MouseEvent) => {
  if (clickeventmask) {
    return
  }
  pointerSend({ type: 'CLICK', ev })
}
export const sendContextMenu = (ev: MouseEvent | React.MouseEvent) =>
  pointerSend({ type: 'CONTEXTMENU', ev })
export const sendWheel = (ev: WheelEvent | React.WheelEvent) => {
  if (wheeleventmask) {
    return
  }
  pointerSend({ type: 'WHEEL', ev })
}
export const sendScroll = (ev: Event | React.UIEvent) =>
  scrollTimeoutActor.send({
    type: 'TICK',
    ev,
  })

const pointerSearchLock = (psvg: Vec) =>
  pointerActor.send({ type: 'SEARCH.LOCK', psvg })
const pointerSearchUnlock = () => pointerActor.send({ type: 'SEARCH.UNLOCK' })

const layoutCb = (origLayout: Readonly<Layout>, force: boolean) => {
  pointerActor.send({ type: 'LAYOUT', layout: origLayout, force })
}

const keyDown = (ev: KeyboardEvent) =>
  pointerActor.send({ type: 'KEY.DOWN', ev })
const keyUp = (ev: KeyboardEvent) => pointerActor.send({ type: 'KEY.UP', ev })

cfg.uiOpenCbs.add(pointerSearchLock)
cfg.uiCloseDoneCbs.add(pointerSearchUnlock)

////

const scrollTimeoutActor = createActor(timeoutMachine)

scrollTimeoutActor.on('EXPIRED', ({ ev }) => {
  if (!scrolleventmask) {
    pointerSend({ type: 'SCROLL', ev })
  }
})
scrollTimeoutActor.start()

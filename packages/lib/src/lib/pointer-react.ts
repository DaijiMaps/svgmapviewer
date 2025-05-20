import { useSelector } from '@xstate/react'
import React, { useEffect } from 'react'
import { createActor } from 'xstate'
import { configActor } from './config'
import { timeoutMachine } from './event-xstate'
import { Layout } from './layout'
import {
  pointerMachine,
  PointerMode,
  ReactUIEvent,
  selectExpanding,
} from './pointer-xstate'
import { resizeActor } from './resize-react'
import { SearchRes } from './types'
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

// XXX
// XXX
// XXX
function useExpanding() {
  // re-render handling
  // XXX - used only for syncing scroll (scrollLeft/scrollTop)
  // XXX   after scroll size change
  const expanding = useSelector(pointerActor, selectExpanding)
  useEffect(() => {
    pointerActor.send({ type: 'RENDERED' })
  }, [expanding])
}
// XXX
// XXX
// XXX

export function usePointer(): void {
  //// actions
  useExpanding()
}

////

export const pointerActor = createActor(pointerMachine, {
  systemId: 'system-pointer1',
})
pointerActor.on('SEARCH', ({ psvg }) =>
  configActor.getSnapshot().context.searchStartCbs.forEach((cb) => cb(psvg))
)
pointerActor.on('LOCK', ({ ok }) =>
  configActor.getSnapshot().context.uiOpenDoneCbs.forEach((cb) => cb(ok))
)
pointerActor.on('LAYOUT', ({ layout }) =>
  configActor.getSnapshot().context.zoomEndCbs.forEach((cb) => cb(layout, 1))
)
pointerActor.on('ZOOM.START', ({ layout, zoom, z }) =>
  configActor
    .getSnapshot()
    .context.zoomStartCbs.forEach((cb) => cb(layout, zoom, z))
)
pointerActor.on('ZOOM.END', ({ layout, zoom }) =>
  configActor.getSnapshot().context.zoomEndCbs.forEach((cb) => cb(layout, zoom))
)
pointerActor.on('MODE', ({ mode }) => reflectMode(mode))

resizeActor.start() // XXX reference
pointerActor.start()

////

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

////

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
export const sendAnimationEnd = (ev: AnimationEvent | React.AnimationEvent) =>
  pointerSend({
    type: 'ANIMATION.END',
    ev,
  })

export const pointerSearchEnd = (res: Readonly<null | SearchRes>) =>
  pointerActor.send({ type: 'SEARCH.END', res })
const pointerSearchLock = (psvg: Vec) =>
  pointerActor.send({ type: 'SEARCH.LOCK', psvg })
const pointerSearchUnlock = () => pointerActor.send({ type: 'SEARCH.UNLOCK' })

const layoutCb = (origLayout: Readonly<Layout>, force: boolean) => {
  pointerActor.send({ type: 'LAYOUT', layout: origLayout, force })
}
export const layoutCb2 = (origLayout: Readonly<Layout>) => {
  pointerActor.send({ type: 'LAYOUT', layout: origLayout, force: true })
}

export const keyDown = (ev: KeyboardEvent) =>
  pointerActor.send({ type: 'KEY.DOWN', ev })
export const keyUp = (ev: KeyboardEvent) =>
  pointerActor.send({ type: 'KEY.UP', ev })

configActor.start()
configActor.send({
  type: 'ADD.CB',
  // XXX searchEndCb
  searchEndCb: pointerSearchEnd,
  // XXX searchEndDone
  uiOpenCb: pointerSearchLock,
  uiCloseDoneCb: pointerSearchUnlock,
  layoutCb: layoutCb,
})

////

const scrollTimeoutActor = createActor(timeoutMachine)

scrollTimeoutActor.on('EXPIRED', ({ ev }) => {
  if (!scrolleventmask) {
    pointerSend({ type: 'SCROLL', ev })
  }
})
scrollTimeoutActor.start()

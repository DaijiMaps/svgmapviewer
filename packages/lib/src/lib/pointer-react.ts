import React from 'react'
import { createActor } from 'xstate'
import {
  notifySearchEndDone,
  notifySearchStart,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyZoomEnd,
  notifyZoomStart,
  registerCbs,
} from './config'
import { timeoutMachine } from './event-xstate'
import { Layout } from './layout'
import { pointerMachine, PointerMode, ReactUIEvent } from './pointer-xstate'
import { setCurrentScroll } from './scroll'
import { SearchRes } from './types'
import { Vec } from './vec'

/// actor

export const pointerActor = createActor(pointerMachine, {
  systemId: 'system-pointer1',
  //inspect,
})

/*
export type PointerInspect = typeof pointerActor.options.inspect
export function inspect(iev: InspectionEvent) {
  if (iev && iev?.actorRef?.options?.systemId === 'system-pointer1') {
    const type =
      iev?.event?.type || iev?.action?.type || iev?.action?.params?.event?.type
    if (type && !type.match(/MOVE/)) {
      console.log(type, iev)
    }
  }
}
*/

//// handler masks

//let pointereventmask: boolean = false
//let toucheventmask: boolean = false
let clickeventmask: boolean = false
let wheeleventmask: boolean = false
let scrolleventmask: boolean = false

function reflectMode(mode: PointerMode): void {
  //pointereventmask = mode !== 'pointing'
  //toucheventmask = mode !== 'pointing'
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

//// handlers

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
    //event.ev.preventDefault()
  }
  if (options?.stopPropagation === false) {
    // skip
  } else {
    event.ev.stopPropagation()
  }
  pointerActor.send(event)
}

////

/*
export const sendPointerDown = (ev: React.PointerEvent<HTMLDivElement>) =>
  pointereventmask ? undefined : pointerSend({ type: 'POINTER.DOWN', ev })

export const sendPointerMove = (ev: React.PointerEvent<HTMLDivElement>) =>
  pointereventmask ? undefined : pointerSend({ type: 'POINTER.MOVE', ev })

export const sendPointerUp = (ev: React.PointerEvent<HTMLDivElement>) =>
  pointereventmask ? undefined : pointerSend({ type: 'POINTER.UP', ev })
*/

/*
export const sendTouchStart = (ev: React.TouchEvent<HTMLDivElement>) => {
  if (toucheventmask) {
    return
  }
  // skip preventDefault to enable emulated "click"
  pointerSend({ type: 'TOUCH.START', ev }, { preventDefault: false })
}
export const sendTouchMove = (ev: React.TouchEvent<HTMLDivElement>) => {
  if (toucheventmask) {
    return
  }
  pointerSend({ type: 'TOUCH.MOVE', ev })
}
export const sendTouchEnd = (ev: React.TouchEvent<HTMLDivElement>) => {
  if (toucheventmask) {
    return
  }
  // skip preventDefault to enable emulated "click"
  pointerSend({ type: 'TOUCH.END', ev }, { preventDefault: false })
}
*/
export const sendClick = (ev: React.MouseEvent<HTMLDivElement>) => {
  if (clickeventmask) {
    return
  }
  pointerSend({ type: 'CLICK', ev })
}
export const sendContextMenu = (ev: React.MouseEvent<HTMLDivElement>) =>
  pointerSend({ type: 'CONTEXTMENU', ev })
export const sendWheel = (ev: React.WheelEvent<HTMLDivElement>) => {
  if (wheeleventmask) {
    return
  }
  pointerSend({ type: 'WHEEL', ev })
}
export const sendScroll = (ev: React.UIEvent<HTMLDivElement, Event>) => {
  if (ev !== null) {
    setCurrentScroll(ev.currentTarget)
  }
  scrollTimeoutActor.send({
    type: 'TICK',
    ev,
  })
}
export const sendAnimationEnd = (ev: React.AnimationEvent<HTMLDivElement>) =>
  pointerSend({
    type: 'ANIMATION.END',
    ev,
  })

export const keyDown = (ev: KeyboardEvent) =>
  pointerActor.send({ type: 'KEY.DOWN', ev })
export const keyUp = (ev: KeyboardEvent) =>
  pointerActor.send({ type: 'KEY.UP', ev })

//// actor

pointerActor.on('SEARCH', ({ psvg }) => notifySearchStart(psvg))
pointerActor.on('SEARCH.END.DONE', ({ psvg, info, layout }) => {
  notifySearchEndDone(psvg, info, layout)
  notifyUiOpen(psvg, info, layout)
})
pointerActor.on('LOCK', ({ ok }) => notifyUiOpenDone(ok))
pointerActor.on('ZOOM.START', ({ layout, zoom, z }) =>
  notifyZoomStart(layout, zoom, z)
)
pointerActor.on('ZOOM.END', ({ layout, zoom }) => notifyZoomEnd(layout, zoom))
pointerActor.on('LAYOUT', ({ layout }) => notifyZoomEnd(layout, 1))
pointerActor.on('MODE', ({ mode }) => reflectMode(mode))
pointerActor.start()

//// config global callbacks

export const pointerSearchEnd = (res: Readonly<SearchRes>) =>
  pointerActor.send({ type: 'SEARCH.END', res })
const pointerSearchLock = (psvg: Vec) =>
  pointerActor.send({ type: 'SEARCH.LOCK', psvg })
const pointerSearchUnlock = () => pointerActor.send({ type: 'SEARCH.UNLOCK' })

const resizeCb = (origLayout: Readonly<Layout>, force: boolean) => {
  pointerActor.send({ type: 'RESIZE', layout: origLayout, force })
}

registerCbs({
  searchEndCb: pointerSearchEnd,
  uiOpenCb: pointerSearchLock,
  uiCloseDoneCb: pointerSearchUnlock,
  resizeCb: resizeCb,
})

////

export const scrollTimeoutActor = createActor(timeoutMachine, {
  input: { expiration: 2000 },
})

scrollTimeoutActor.on('EXPIRED', ({ ev }) => {
  if (!scrolleventmask) {
    pointerSend({ type: 'SCROLL', ev })
  }
})
scrollTimeoutActor.start()

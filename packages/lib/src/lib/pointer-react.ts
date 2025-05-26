import React from 'react'
import { scrollTimeoutActorSend } from './event-xstate'
import { clickeventmask, pointerSend, pointerSendEvent } from './pointer-xstate'
import { setCurrentScroll } from './scroll'

/// actor

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

////

export const sendClick = (ev: React.MouseEvent<HTMLDivElement>): void => {
  if (clickeventmask) {
    return
  }
  pointerSendEvent({ type: 'CLICK', ev })
}
export const sendContextMenu = (ev: React.MouseEvent<HTMLDivElement>): void =>
  pointerSendEvent({ type: 'CONTEXTMENU', ev })
export const sendWheel = (ev: React.WheelEvent<HTMLDivElement>): void => {
  pointerSendEvent({ type: 'WHEEL', ev })
}
export const sendScroll = (ev: React.UIEvent<HTMLDivElement, Event>): void => {
  if (ev !== null) {
    setCurrentScroll(ev.currentTarget)
  }
  scrollTimeoutActorSend({
    type: 'TICK',
    ev,
  })
}
export const sendAnimationEnd = (
  ev: React.AnimationEvent<HTMLDivElement>
): void =>
  pointerSendEvent({
    type: 'ANIMATION.END',
    ev,
  })

export const keyDown = (ev: KeyboardEvent): void =>
  pointerSend({ type: 'KEY.DOWN', ev })
export const keyUp = (ev: KeyboardEvent): void =>
  pointerSend({ type: 'KEY.UP', ev })

//// actor

//// config global callbacks

////

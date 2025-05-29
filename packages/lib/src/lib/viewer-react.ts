import React from 'react'
import { setCurrentScroll } from './scroll'
import { clickeventmask, viewerSend, viewerSendEvent } from './viewer-xstate'

/// actor

/*
export type ViewerInspect = typeof viewerActor.options.inspect
export function inspect(iev: InspectionEvent) {
  if (iev && iev?.actorRef?.options?.systemId === 'system-viewer1') {
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
  viewerSendEvent({ type: 'CLICK', ev })
}
export const sendContextMenu = (ev: React.MouseEvent<HTMLDivElement>): void =>
  viewerSendEvent({ type: 'CONTEXTMENU', ev })
export const sendWheel = (ev: React.WheelEvent<HTMLDivElement>): void => {
  viewerSendEvent({ type: 'WHEEL', ev })
}
export const sendScroll = (ev: React.UIEvent<HTMLDivElement, Event>): void => {
  if (ev !== null) {
    setCurrentScroll(ev)
  }
  /*
  scrollTimeoutActorSend({
    type: 'TICK',
    ev,
  })
  */
}
export const sendAnimationEnd = (
  ev: React.AnimationEvent<HTMLDivElement>
): void =>
  viewerSendEvent({
    type: 'ANIMATION.END',
    ev,
  })

export const keyDown = (ev: KeyboardEvent): void =>
  viewerSend({ type: 'KEY.DOWN', ev })
export const keyUp = (ev: KeyboardEvent): void =>
  viewerSend({ type: 'KEY.UP', ev })

//// actor

//// config global callbacks

////

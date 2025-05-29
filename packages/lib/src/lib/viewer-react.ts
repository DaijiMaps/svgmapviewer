import React from 'react'
import { setCurrentScroll } from './scroll'
import { clickeventmask, viewerSend, viewerSendEvent } from './viewer-xstate'

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

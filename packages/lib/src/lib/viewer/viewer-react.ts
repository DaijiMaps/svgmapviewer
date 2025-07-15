import React from 'react'
import { notifyScroll } from './scroll'
import { clickeventmask, viewerSend, viewerSendEvent } from './viewer-xstate'

export function sendClick(ev: React.MouseEvent<HTMLDivElement>): void {
  if (clickeventmask) {
    return
  }
  viewerSendEvent({ type: 'CLICK', ev })
}
export function sendContextMenu(ev: React.MouseEvent<HTMLDivElement>): void {
  viewerSendEvent({ type: 'CONTEXTMENU', ev })
}
export function sendWheel(ev: React.WheelEvent<HTMLDivElement>): void {
  viewerSendEvent({ type: 'WHEEL', ev })
}
export function sendScroll(ev: React.UIEvent<HTMLDivElement, Event>): void {
  if (ev !== null) {
    notifyScroll(ev)
  }
}
export function sendAnimationEnd(
  ev: React.AnimationEvent<HTMLDivElement>
): void {
  viewerSendEvent({
    type: 'ANIMATION.END',
    ev,
  })
}

export function keyDown(ev: KeyboardEvent): void {
  viewerSend({ type: 'KEY.DOWN', ev })
}
export function keyUp(ev: KeyboardEvent): void {
  viewerSend({ type: 'KEY.UP', ev })
}

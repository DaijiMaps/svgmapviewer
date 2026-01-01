import { notifyScrollEventTick } from '../event-scroll'
import { clickeventmask, viewerSendEvent } from './viewer-xstate'
import { keyboardSend } from './input/keyboard-xstate'

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
    notifyScrollEventTick(ev)
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
  keyboardSend({ type: 'DOWN', key: ev.key })
}
export function keyUp(ev: KeyboardEvent): void {
  keyboardSend({ type: 'UP', key: ev.key })
}

import { notifyScrollEventTick } from '../event-scroll'
import { clickeventmask, viewerSend, viewerSendEvent } from './viewer-xstate'

export function sendClick(ev: React.MouseEvent<HTMLDivElement>): void {
  if (clickeventmask) {
    return
  }
  viewerSend({ type: 'SEARCH', pos: { x: ev.pageX, y: ev.pageY } })
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

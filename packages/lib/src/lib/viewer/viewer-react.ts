import { notifyScroll } from '../event-scroll'
import { busies } from './scroll/scroll'
import { clickeventmask, viewerSend, viewerSendEvent } from './viewer-xstate'

export function sendClick(ev: React.MouseEvent<HTMLDivElement>): void {
  if (clickeventmask) {
    return
  }
  viewerSend({ type: 'SEARCH', pos: { x: ev.pageX, y: ev.pageY } })
}
export function sendScroll(ev: React.UIEvent<HTMLDivElement, Event>): void {
  if (ev === null) return
  const prevId = busies.get('S')
  if (prevId) clearTimeout(prevId)
  const id = setTimeout(() => busies.delete('S'), 500)
  busies.set('S', id)
  notifyScroll.eventTick(ev)
}
export function sendAnimationEnd(
  ev: React.AnimationEvent<HTMLDivElement>
): void {
  viewerSendEvent({
    type: 'ANIMATION.END',
    ev,
  })
}

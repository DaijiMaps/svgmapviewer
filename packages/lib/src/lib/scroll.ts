/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { BoxBox as Box, boxBox, BoxBox } from './box/prefixed'

// XXX make this async
// XXX call this from scroll-xstate as invoke (Promise)
// XXX return status
export const syncScroll = (b: Box): boolean => {
  const e = document.querySelector('.container')

  // assume valid if scrollLeft exists
  if (e === null || e.scrollLeft === null || b === null) {
    return false
  }
  // box pointing to the identical element?
  if (
    Math.abs(e.scrollWidth - b.width) > 1 ||
    Math.abs(e.scrollHeight - b.height) > 1
  ) {
    return false
  }
  const left = Math.round(-b.x)
  const top = Math.round(-b.y)
  if (left < 0 || top < 0) {
    return false
  }
  if (e.scrollLeft !== left) {
    e.scrollLeft = left
  }
  if (e.scrollTop !== top) {
    e.scrollTop = top
  }

  return true
}

export function getScroll(): null | BoxBox {
  const e = document.querySelector('.container')

  if (e !== null) {
    // forcibly stop scroll
    e.scroll(e.scrollLeft, e.scrollTop)
    return boxBox(e.scrollLeft, e.scrollTop, e.scrollWidth, e.scrollHeight)
  }
  return null
}

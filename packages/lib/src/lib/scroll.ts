/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { BoxBox as Box, boxBox, BoxBox } from './box/prefixed'

// XXX make this async
// XXX call this from scroll-xstate as invoke (Promise)
// XXX return status
export const syncScroll = (b: Box): boolean => {
  if (b === null) {
    return true
  }

  const e = document.querySelector('.container')

  // assume valid if scrollLeft exists
  if (e === null || e.scrollLeft === null) {
    return false
  }
  // box pointing to the identical element?
  if (
    Math.abs(e.scrollWidth - b.width) > 1 ||
    Math.abs(e.scrollHeight - b.height) > 1
  ) {
    console.error(
      `scroll: target smaller than expected: [${e.scrollWidth}, ${e.scrollHeight}] vs. [${b.width}, ${b.height}]`
    )
    return false
  }
  const left = Math.round(-b.x)
  const top = Math.round(-b.y)
  if (left < 0 || top < 0) {
    console.log(`scroll: out-of-bound request: [${b.x}], [${b.y}]`)
    return false
  }
  if (e.scrollLeft !== left) {
    e.scrollLeft = left
  }
  if (e.scrollTop !== top) {
    e.scrollTop = top
  }
  if (e.scrollLeft !== left) {
    return false
  }
  if (e.scrollTop !== top) {
    return false
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

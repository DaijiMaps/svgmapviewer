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

  if (e === null) {
    return false
  }
  const l = e.scrollLeft
  const t = e.scrollTop
  const w = e.scrollWidth
  const h = e.scrollHeight

  // assume valid if scrollLeft exists
  if (l === null) {
    return false
  }
  // box pointing to the identical element?
  if (Math.abs(w - b.width) > 1 || Math.abs(h - b.height) > 1) {
    // not really an error; the element may be still unstable (reflow)
    console.log(
      `scroll: target smaller than expected: target=[${w}, ${h}] vs. request=[${b.width}, ${b.height}]`
    )
    return false
  }
  const left = Math.round(-b.x)
  const top = Math.round(-b.y)
  if (left < 0 || top < 0) {
    console.error(`scroll: out-of-bound request: [${b.x}], [${b.y}]`)
    return false
  }

  // commit the change
  if (l !== left) {
    e.scrollLeft = left
  }
  if (t !== top) {
    e.scrollTop = top
  }

  const l2 = e.scrollLeft
  const t2 = e.scrollTop
  if (l2 !== left) {
    return false
  }
  if (t2 !== top) {
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

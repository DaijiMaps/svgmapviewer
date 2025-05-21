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

  // XXX
  // XXX
  // XXX
  // XXX if content is not rendered yet, this triggers Forced Reflow
  // XXX see: https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing?utm_source=devtools&utm_campaign=stable#identify_forced_synchronous_layouts_and_thrashing
  // XXX
  // XXX
  // XXX
  const l = e.scrollLeft
  const t = e.scrollTop
  const w = e.scrollWidth
  const h = e.scrollHeight

  // assume valid if scrollLeft exists
  if (l === null) {
    return false
  }
  // box pointing to the identical element?
  const dw = w - b.width
  const dh = h - b.height
  if (Math.abs(dw) > 1 || Math.abs(dh) > 1) {
    // not really an error; the element may be still unstable (reflow)
    console.log(
      `scroll: target ${dw > 0 ? 'larger' : 'smaller'} than expected: target=[${w}, ${h}] vs. request=[${b.width}, ${b.height}]`
    )
    return false
  }
  const left = Math.round(-b.x)
  const top = Math.round(-b.y)
  if (left < 0 || top < 0) {
    console.error(`scroll: out-of-bound request: [${b.x}], [${b.y}]`)
    return false
  }

  // commit the change!
  if (l !== left) {
    e.scrollLeft = left
  }
  if (t !== top) {
    e.scrollTop = top
  }

  const l2 = e.scrollLeft
  const dl = l2 - left
  if (Math.abs(dl) > 1) {
    console.log(
      `scroll: scrollLeft not reflected: expected=${l} vs. real=${l2}`
    )
    return false
  }
  const t2 = e.scrollTop
  const dt = t2 - top
  if (Math.abs(dt) > 1) {
    console.log(
      `scroll: scrollHeight not reflected: expected=${t} vs. real=${t2}`
    )
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

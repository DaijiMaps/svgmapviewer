/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { type CurrentScroll, type Scroll } from '../../types'
import { boxBox, boxUnit, type BoxBox } from '../box/prefixed'

// XXX make this async
// XXX call this from scroll-xstate as invoke (Promise)
// XXX return status
export function syncScroll(b: BoxBox): boolean {
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
  const x = e.scrollLeft
  const y = e.scrollTop
  const width = e.scrollWidth
  const height = e.scrollHeight

  // assume valid if scrollLeft exists
  if (x === null) {
    return false
  }
  // box pointing to the identical element?
  const dw = width - b.width
  const dh = height - b.height
  if (Math.abs(dw) > 1 || Math.abs(dh) > 1) {
    // not really an error; the element may be still unstable (reflow)
    console.log(
      `scroll: target ${dw > 0 ? 'larger' : 'smaller'} than expected: target=[${width}, ${height}] vs. request=[${b.width}, ${b.height}]`
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
  if (x !== left) {
    e.scrollLeft = left
  }
  if (y !== top) {
    e.scrollTop = top
  }

  const x2 = e.scrollLeft
  const dx = x2 - left
  if (Math.abs(dx) > 1) {
    console.log(
      `scroll: scrollLeft not reflected: expected=${x} vs. real=${x2}`
    )
    return false
  }
  const y2 = e.scrollTop
  const dy = y2 - top
  if (Math.abs(dy) > 1) {
    console.log(
      `scroll: scrollHeight not reflected: expected=${y} vs. real=${y2}`
    )
    return false
  }

  return true
}

export function getScroll(): Scroll {
  const e = document.querySelector('.container')

  if (e !== null) {
    const x = e.scrollLeft
    const y = e.scrollTop
    const width = e.scrollWidth
    const height = e.scrollHeight

    // forcibly stop scroll
    // XXX assigning a different value once
    // XXX because assigning the current value is ignored
    // XXX (does NOT stop scroll)
    e.scrollLeft = Number(x) + 1
    e.scrollLeft = Number(x)

    return boxBox(x, y, width, height)
  }
  return null
}

////

// eslint-disable-next-line functional/no-let
export let currentScroll: CurrentScroll = {
  scroll: boxUnit,
  client: { width: 0, height: 0 },
  timeStamp: 0,
}

export function setCurrentScroll(
  ev: Readonly<React.UIEvent<HTMLDivElement, Event>>
): void {
  const e: null | HTMLDivElement = ev.currentTarget
  if (e !== null) {
    currentScroll = {
      scroll: {
        x: e.scrollLeft,
        y: e.scrollTop,
        width: e.scrollWidth,
        height: e.scrollHeight,
      },
      client: {
        width: e.clientWidth,
        height: e.clientHeight,
      },
      timeStamp: ev.timeStamp,
    }
  }
}

export function getCurrentScroll(): CurrentScroll {
  return currentScroll
}

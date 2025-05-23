/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useEffect, useRef } from 'react'
import './Container.css'
import {
  sendAnimationEnd,
  sendClick,
  sendContextMenu,
  sendPointerDown,
  sendPointerMove,
  sendPointerUp,
  sendScroll,
  sendTouchEnd,
  sendTouchMove,
  sendTouchStart,
  sendWheel,
  usePointer,
} from './lib/pointer-react'
import { styleAnimationEnd } from './lib/style-xstate'
import { MapHtmlRoot } from './MapHtmlRoot'
import { MapSvg } from './MapSvg'

export function Container() {
  const ref = useRef<HTMLDivElement>(null)

  usePointer()

  useEffect(() => {
    const e = ref.current
    if (e === null) {
      return
    }
    e.addEventListener('pointerdown', sendPointerDown)
    e.addEventListener('pointermove', sendPointerMove)
    e.addEventListener('pointerup', sendPointerUp)
    //e.addEventListener('touchstart', sendTouchStart)
    //e.addEventListener('touchmove', sendTouchMove)
    //e.addEventListener('touchend', sendTouchEnd)
    //e.addEventListener('click', sendClick)
    //e.addEventListener('contextmenu', sendContextMenu)
    //e.addEventListener('wheel', sendWheel)
    //e.addEventListener('scroll', sendScroll)
    e.addEventListener('animationend', sendAnimationEnd)
    e.addEventListener('animationend', styleAnimationEnd)
    return () => {
      e.removeEventListener('pointerdown', sendPointerDown)
      e.removeEventListener('pointermove', sendPointerMove)
      e.removeEventListener('pointerup', sendPointerUp)
      //e.removeEventListener('touchstart', sendTouchStart)
      //e.removeEventListener('touchmove', sendTouchMove)
      //e.removeEventListener('touchend', sendTouchEnd)
      //e.removeEventListener('click', sendClick)
      //e.removeEventListener('contextmenu', sendContextMenu)
      //e.removeEventListener('wheel', sendWheel)
      //e.removeEventListener('scroll', sendScroll)
      e.removeEventListener('animationend', sendAnimationEnd)
      e.removeEventListener('animationend', styleAnimationEnd)
    }
  }, [])

  return (
    <div
      ref={ref}
      id="viewer"
      className="container"
      onTouchStart={sendTouchStart}
      onTouchMove={sendTouchMove}
      onTouchEnd={sendTouchEnd}
      onClick={sendClick}
      onContextMenu={sendContextMenu}
      onScroll={sendScroll}
      onWheel={sendWheel}
    >
      <MapSvg />
      <MapHtmlRoot />
    </div>
  )
}

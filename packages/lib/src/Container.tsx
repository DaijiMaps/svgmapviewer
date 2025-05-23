/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useRef } from 'react'
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

  return (
    <div
      ref={ref}
      id="viewer"
      className="container"
      onPointerDown={sendPointerDown}
      onPointerMove={sendPointerMove}
      onPointerUp={sendPointerUp}
      onTouchStart={sendTouchStart}
      onTouchMove={sendTouchMove}
      onTouchEnd={sendTouchEnd}
      onClick={sendClick}
      onContextMenu={sendContextMenu}
      onScroll={sendScroll}
      onWheel={sendWheel}
      onAnimationEnd={(ev) => {
        sendAnimationEnd(ev)
        styleAnimationEnd()
      }}
    >
      <MapSvg />
      <MapHtmlRoot />
    </div>
  )
}

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
  sendWheel,
} from './lib/pointer-react'
import { styleAnimationEnd } from './lib/style-xstate'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './lib/touch-react'
import { MapHtmlRoot } from './MapHtmlRoot'
import { MapSvg } from './MapSvg'

export function Container() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      id="viewer"
      className="container"
      onPointerDown={sendPointerDown}
      onPointerMove={sendPointerMove}
      onPointerUp={sendPointerUp}
      onTouchStart={touchSendTouchStart}
      onTouchMove={touchSendTouchMove}
      onTouchEnd={touchSendTouchEnd}
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

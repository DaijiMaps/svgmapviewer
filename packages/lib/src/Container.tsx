/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode, useRef } from 'react'
import './Container.css'
import { styleAnimationEnd } from './lib/style-xstate'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './lib/touch-xstate'
import {
  sendAnimationEnd,
  sendClick,
  sendContextMenu,
  sendScroll,
  sendWheel,
} from './lib/viewer-react'
import { MapHtmlRoot } from './MapHtmlRoot'
import { MapSvgRoot } from './MapSvgRoot'
import { MapSvgSymbolsRoot } from './MapSvgSymbolsRoot'

export function Container(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      id="viewer"
      className="container"
      //onPointerDown={sendPointerDown}
      //onPointerMove={sendPointerMove}
      //onPointerUp={sendPointerUp}
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
      <MapSvgRoot />
      <MapSvgSymbolsRoot />
      <MapHtmlRoot />
    </div>
  )
}

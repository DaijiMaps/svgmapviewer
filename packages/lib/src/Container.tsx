/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode, useRef } from 'react'
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
import { MapSvgRoot } from './MapSvg'
import { MapSvgLabelsRoot } from './MapSvgLabels'
import { MapSvgMarkersRoot } from './MapSvgMarkers'
import { MapSvgSymbolsRoot } from './MapSvgSymbols'
import { ContainerStyle } from './Style'

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
      <MapSvgMarkersRoot />
      <MapSvgLabelsRoot />
      <style>{`@scope {
${style}
}`}</style>
      <ContainerStyle />
    </div>
  )
}

const style = `
:scope {
  width: 100vw;
  height: 100vh;
  height: 100svh;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  cursor: pointer;
  overscroll-behavior: none;
  will-change: scroll-position;

  scrollbar-width: thin;
}

.content {
  position: absolute;
  left: 0;
  top: 0;
}

:scope,
.content.svg {
  background: none;
}
`

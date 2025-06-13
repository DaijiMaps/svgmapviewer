/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode, useRef } from 'react'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from './lib/css'
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
import { MapSvgLabelsRoot } from './MapSvgLabels'
import { MapSvgLayersRoot } from './MapSvgLayers'
import { MapSvgMarkersRoot } from './MapSvgMarkers'
import { MapSvgObjectsRoot } from './MapSvgObjects'
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
      <MapSvgLayersRoot />
      <MapSvgObjectsRoot />
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
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}

  scrollbar-width: thin;
  cursor: move;

  overflow: scroll;
  overscroll-behavior: none;
  touch-action: pan-x pan-y;

  will-change: scroll-position;
}

.content {
  ${position_absolute_left_0_top_0}
}

:scope,
.content.svg {
  background: none;
}
`

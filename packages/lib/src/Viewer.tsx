/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode, useRef } from 'react'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from './lib/css'
import type { Matrix } from './lib/matrix'
import { matrixEmpty, matrixToString } from './lib/matrix/prefixed'
import { styleAnimationEnd, useAnimation } from './lib/style-xstate'
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

export function Viewer(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      id="viewer"
      className="container"
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
      <style>{style}</style>
      <AnimationStyle />
    </div>
  )
}

const style: string = `
.container {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}

  scrollbar-width: thin;

  overflow: scroll;
  overscroll-behavior: none;
  touch-action: pan-x pan-y;

  will-change: scroll-position;
  contain: strict;
}

.content {
  ${position_absolute_left_0_top_0}
  contain: strict;
}
`

function AnimationStyle(): ReactNode {
  const animation = useAnimation()
  const q = animation?.move?.q ?? animation?.zoom?.q ?? null
  const style = q === null ? '' : css(q)
  return <style>{style}</style>
}

function css(q: Matrix): string {
  return `
#viewer {
  will-change: transform;
  animation: container-zoom ${500}ms ease;
}
@keyframes container-zoom {
  from {
    transform-origin: left top;
    transform: ${matrixToString(matrixEmpty)} translate3d(0px, 0px, 0px);
  }
  to {
    transform-origin: left top;
    transform: ${matrixToString(q)} translate3d(0px, 0px, 0px);
  }
}
`
}

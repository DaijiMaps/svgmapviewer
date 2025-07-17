/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode, useRef } from 'react'
import { svgMapViewerConfig } from '../../config'
import { styleAnimationEnd, useAnimation } from '../../style-xstate'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from '../css'
import type { Matrix } from '../matrix'
import { matrixEmpty, matrixToString } from '../matrix/prefixed'
import { useFloors } from './floors-xstate'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './touch-xstate'
import {
  sendAnimationEnd,
  sendClick,
  sendContextMenu,
  sendScroll,
  sendWheel,
} from './viewer-react'

export function Container(): ReactNode {
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
      {svgMapViewerConfig.renderMap()}
      <style>{style}</style>
      <AnimationStyle />
      <FloorsStyle />
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
  transform: translate3d(0, 0, 0);
}
`

function AnimationStyle(): ReactNode {
  const animation = useAnimation()
  const q = animation?.move?.q ?? animation?.zoom?.q ?? null
  const style = q === null ? '' : css(q)
  return <style>{style}</style>
}

function FloorsStyle(): ReactNode {
  const { fidx, oldFidx, newFidx } = useFloors()
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return <></>
  }
  const style = floorsConfig.floors
    .map((_, idx) =>
      idx === fidx || idx === oldFidx || idx === newFidx
        ? ``
        : `.fidx-${idx} { display: none; }`
    )
    .join('\n')
  const animation =
    oldFidx === null || newFidx === null
      ? ``
      : `
.fidx-${oldFidx} {
  will-change: opacity;
  animation: xxx-disappearing 500ms linear;
}
.fidx-${newFidx} {
  will-change: opacity;
  animation: xxx-appearing 500ms linear;
}
@keyframes xxx-disappearing {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes xxx-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`
  return (
    <style>
      {style}
      {animation}
    </style>
  )
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

export function isContainerRendered(): boolean {
  return document.querySelector('.container') !== null
}

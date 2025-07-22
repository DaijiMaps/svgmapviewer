/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode, useRef } from 'react'
import { svgMapViewerConfig } from '../../config'
import {
  styleAnimationEnd,
  useAnimation,
  useLayoutContent,
} from '../../style-xstate'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from '../css'
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
      <ContentStyle />
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
`

function ContentStyle(): ReactNode {
  const content = useLayoutContent()

  // XXX rotate
  const style = `
.content {
  ${position_absolute_left_0_top_0}
  contain: strict;
  transform: ${content.toString()} translate3d(0, 0, 0);
  transform-origin: left top;
}
`
  return <style>{style}</style>
}

function AnimationStyle(): ReactNode {
  const q = useAnimation()
  const style = q === null ? '' : css(q)
  return <style>{style}</style>
}

function css(q: DOMMatrixReadOnly): string {
  return `
#viewer {
  will-change: transform;
  animation: container-zoom ${500}ms ease;
}
@keyframes container-zoom {
  from {
    transform-origin: left top;
    transform: ${new DOMMatrixReadOnly().toString()} translate3d(0px, 0px, 0px);
  }
  to {
    transform-origin: left top;
    transform: ${q.toString()} translate3d(0px, 0px, 0px);
  }
}
`
}

function FloorsStyle(): ReactNode {
  const { style } = useFloors()
  return style === null ? <></> : <style>{style}</style>
}

export function isContainerRendered(): boolean {
  return document.querySelector('.container') !== null
}

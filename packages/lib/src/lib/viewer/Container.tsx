/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useRef, type PropsWithChildren, type ReactNode } from 'react'
import { type AnimationMatrix } from '../../types'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from '../css'
import { notifyStyleAnimationEnd } from '../event-style'
import { useAnimation, useLayoutContent } from '../style/style-react'
import { useFloors } from './floors-react'
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

export function Container(props: Readonly<PropsWithChildren>): ReactNode {
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
        notifyStyleAnimationEnd()
      }}
    >
      {props.children}
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
  pointer-events: none;
}
`
  return <style>{style}</style>
}

function AnimationStyle(): ReactNode {
  const a = useAnimation()
  const style = a === null ? '' : css(a)
  return <style>{style}</style>
}

function css({ matrix: q, origin: o }: Readonly<AnimationMatrix>): string {
  const p = new DOMMatrixReadOnly()
  return `
#viewer {
  will-change: transform;
  animation: container-zoom 500ms ease;
}
@keyframes container-zoom {
  from {
    transform-origin: ${o === null ? `left top` : `${o.x}px ${o.y}px`};
    transform: ${p.toString()} translate3d(0px, 0px, 0px);
  }
  to {
    transform-origin: ${o === null ? `left top` : `${o.x}px ${o.y}px`};
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

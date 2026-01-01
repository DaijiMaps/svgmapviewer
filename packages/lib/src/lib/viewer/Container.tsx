/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useRef, type PropsWithChildren, type ReactNode } from 'react'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from '../css'
import { notifyStyleAnimationEnd } from '../event-style'
import { useAnimationStyle, useLayoutContent } from '../style/style-react'
import { useFloors } from './floors/floors-react'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './touch/touch-xstate'
import { sendAnimationEnd, sendClick, sendScroll } from './viewer-react'
import { sendContextMenu } from './input/input'

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

  scrollbar-width: none;

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
  const style = useAnimationStyle()
  return <style>{style}</style>
}

function FloorsStyle(): ReactNode {
  const { style } = useFloors()
  return style === null ? <></> : <style>{style}</style>
}

export function isContainerRendered(): boolean {
  return document.querySelector('.container') !== null
}

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useRef, type PropsWithChildren, type ReactNode } from 'react'

import {
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  width_100vw_height_100svh,
  ZOOM_DURATION_DETAIL,
} from '../css'
import { notifyStyle } from '../event-style'
import {
  useAnimationStyle,
  useLayoutContent,
  useZoomingStyle,
} from '../style/style-react'
import { useOpenCloseDetailStyle } from '../ui/ui-react'
import { useFloors } from './floors/floors-react'
import { sendContextMenu } from './input/input'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './touch/touch-xstate'
import { sendAnimationEnd, sendClick, sendScroll } from './viewer-react'

export function Container(props: Readonly<PropsWithChildren>): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useOpenCloseDetailStyle(ref)
  useZoomingStyle(ref)
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
        notifyStyle.animationEnd()
      }}
    >
      {props.children}
      <ContainerStyle />
    </div>
  )
}

function ContainerStyle(): ReactNode {
  const style: string = `
.container {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}

  scrollbar-behavior: smooth;
  scrollbar-width: none;

  overflow: scroll;
  overscroll-behavior: none;
  touch-action: pan-x pan-y;

  will-change: scroll-position;
  contain: strict;

  /*
  &.not-animating {
    &.closed {
      opacity: 1;
    }
    &.opened {
      opacity: 0.5;
    }
  }
  &.animating {
    &.closed {
      --a: 0.5;
      --b: 1;
      --timing: ${timing_closing};
    }
    &.opened {
      --a: 1;
      --b: 0.5;
      --timing: ${timing_opening};
    }
    --duration: ${ZOOM_DURATION_DETAIL}ms;
    animation: xxx-container var(--duration) var(--timing);
  }
  */
}
@keyframes xxx-container {
  from {
    opacity: var(--a);
  }
  to {
    opacity: var(--b);
  }
}
`

  return (
    <>
      <style>{style}</style>
      <ContentStyle />
      <AnimationStyle />
      <FloorsStyle />
    </>
  )
}

function ContentStyle(): ReactNode {
  const content = useLayoutContent()

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

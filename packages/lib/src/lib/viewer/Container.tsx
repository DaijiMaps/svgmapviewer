/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useRef, type PropsWithChildren, type ReactNode } from 'react'

import {
  position_absolute_left_0_top_0,
  timing_opening,
  width_100vw_height_100svh,
  ZOOM_DURATION_CONTAINER,
} from '../css'
import { notifyStyle } from '../event-style'
import { useAppearingStyleRef } from '../style/appearing'
import { useDetailStyleRef } from '../ui/style'
import { sendContextMenu } from './input/input'
import { useZoomStyleRef } from './layout/style'
import { useScrollRef } from './scroll/style'
import { useTouchMoveZoomingLock } from './touch/event'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './touch/touch-xstate'
import { sendAnimationEnd, sendClick, sendScroll } from './viewer-react'

export function Container(props: Readonly<PropsWithChildren>): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useDetailStyleRef(ref, 'container')
  useTouchMoveZoomingLock(ref)
  useZoomStyleRef(ref, 'container')
  useAppearingStyleRef(ref, 'container')
  useScrollRef(ref, 'container')
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
      <style>{style}</style>
    </div>
  )
}

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

  &.zooming {
    will-change: transform;
    transform-origin: var(--zoom-origin);
    animation: container-zoom ${ZOOM_DURATION_CONTAINER}ms ease;
    &.rotating {
      animation: container-rotate ${ZOOM_DURATION_CONTAINER}ms ease;
    }
  }
  & > .content {
    ${position_absolute_left_0_top_0}
    contain: strict;
    transform: var(--layout-content-matrix) translate3d(0, 0, 0);
    transform-origin: 0% 0%;
    pointer-events: none;
    width: var(--layout-scroll-width);
    height: var(--layout-scroll-height);
  }
  &.not-shown {
    opacity: 0;
  }
  &.shown {
  }
  &.not-appearing {
  }
  &.appearing {
    will-change: opacity;
    animation: xxx-appearing 2s ${timing_opening};
  }
}
@keyframes container-zoom {
  from {
    transform: translate(var(--zoom-tx-a), var(--zoom-ty-a)) scale(var(--zoom-s-a)) translate3d(0px, 0px, 0px);
  }
  to {
    transform: translate(var(--zoom-tx-b), var(--zoom-ty-b)) scale(var(--zoom-s-b)) translate3d(0px, 0px, 0px);
  }
}
@keyframes container-rotate {
  from {
    transform: rotate(var(--rotate-deg-a)) translate3d(0px, 0px, 0px);
  }
  to {
    transform: rotate(var(--rotate-deg-b)) translate3d(0px, 0px, 0px);
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

export function isContainerRendered(): boolean {
  return document.querySelector('.container') !== null
}

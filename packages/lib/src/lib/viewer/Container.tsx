/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useRef, type PropsWithChildren, type ReactNode } from 'react'

import {
  position_absolute_left_0_top_0,
  timing_opening,
  width_100vw_height_100svh,
} from '../css'
import { notifyStyle } from '../event-style'
import { useAppearingStyleRef } from '../style/appearing'
import { useDetailStyleRef } from '../ui/style'
import { sendContextMenu } from './input/input'
import { useZoomStyleRef } from './layout/style'
import { useLayoutStyleRef } from './layout/style'
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
  useLayoutStyleRef(ref, 'container')
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
    transform-origin: var(--zoom-origin);
    transform: translate(var(--zoom-tx), var(--zoom-ty)) scale(var(--zoom-s)) translate3d(0px, 0px, 0px);
    will-change: transform;
    /*
    animation: container-zoom 500ms ease;
    */
  }
  & > .content {
    ${position_absolute_left_0_top_0}
    contain: strict;
    transform: var(--layout-content-matrix) translate3d(0, 0, 0);
    transform-origin: left top;
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
@property --zoom-tx {
  syntax: '<length>';
  inherits: true;
  initial-value: 0;
}
@property --zoom-ty {
  syntax: '<length>';
  inherits: true;
  initial-value: 0;
}
@property --zoom-s {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --zoom-s-inv {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --zoom-z {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --zoom-z-inv {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --a {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --b {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --opacity {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
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

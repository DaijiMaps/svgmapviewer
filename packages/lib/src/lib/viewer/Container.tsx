/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import {
  useEffect,
  useRef,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from 'react'

import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from '../css'
import { notifyStyle } from '../event-style'
import { useOpenCloseDetailStyle } from '../ui/ui-react'
import { sendContextMenu } from './input/input'
import { animationRefs } from './layout/animation'
import { layoutRefs } from './layout/style'
import {
  touchSendTouchEnd,
  touchSendTouchMove,
  touchSendTouchStart,
} from './touch/touch-xstate'
import { sendAnimationEnd, sendClick, sendScroll } from './viewer-react'
import { viewerZooming } from './viewer-xstate'

function handleTouchMove(ev: Readonly<TouchEvent>) {
  if (viewerZooming.get()) {
    ev.preventDefault()
  }
}

function useHandleTouchMove(
  ref: Readonly<RefObject<HTMLDivElement | null>>
): void {
  useEffect(() => {
    const e = ref.current
    if (e) e.addEventListener('touchmove', handleTouchMove)
    return () => {
      if (e) e.removeEventListener('touchmove', handleTouchMove)
    }
  }, [ref])
}

export function Container(props: Readonly<PropsWithChildren>): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useOpenCloseDetailStyle(ref)
  useHandleTouchMove(ref)
  useEffect(() => {
    animationRefs.set('container', ref)
    layoutRefs.set('container', ref)
    return () => {
      layoutRefs.delete('container')
      animationRefs.delete('container')
    }
  }, [])
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
    animation: container-zoom 500ms ease;
  }
  & > .content {
    ${position_absolute_left_0_top_0}
    contain: strict;
    transform: var(--layout-content-matrix) translate3d(0, 0, 0);
    transform-origin: left top;
    pointer-events: none;
  }
}
@keyframes xxx-container {
  from {
    opacity: var(--a);
  }
  to {
    opacity: var(--b);
  }
}
@keyframes container-zoom {
  from {
    transform-origin: var(--zoom-transform-origin-p);
    transform: var(--zoom-transform-p);
  }
  to {
    transform-origin: var(--zoom-transform-origin-q);
    transform: var(--zoom-transform-q);
  }
}
`

export function isContainerRendered(): boolean {
  return document.querySelector('.container') !== null
}

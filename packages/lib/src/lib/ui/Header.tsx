/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

import { svgMapViewerConfig as config } from '../../config'
import {
  flex_column_center_center,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { notifyAction } from '../event-action'
import { FloorName } from './Floor'
import { useOpenCloseHeader } from './ui-react'
import { uiSend } from './ui-xstate'

export function Header(): ReactNode {
  useShadowRoot('header', <HeaderRoot />, 'ui')

  return <div id="header" />
}

function HeaderRoot(): ReactNode {
  const ref = useStyle()

  return (
    <div
      ref={ref}
      className="ui-content header"
      onAnimationEnd={() => uiSend({ type: 'HEADER.ANIMATION.END' })}
    >
      <h1 className="title" onClick={() => notifyAction.reset()}>
        {config.title}
      </h1>
      <FloorName />
      <style>{style}</style>
    </div>
  )
}

const style = `
.header {
  ${position_absolute_left_0_top_0}
  ${flex_column_center_center}
  padding: 0.5em;
  font-size: smaller;
  pointer-events: none;
  h1,
  h2,
  p {
    ${user_select_none}
    ${pointer_events_initial}
  }
  h1,
  h2 {
    margin: 0.25em;
    font-weight: 100;
    cursor: default;
    text-align: center;
    font-size: large;
  }
  transform-origin: 50% 0%;
  
  &.not-animating {
    &.opened {
      --b: 1;
    }
    &.closed {
      --b: 0;
    }
    will-change: none;
    animation: none;
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
    opacity: var(--b);
  }
  &.animating {
    &.opened {
      --a: 0;
      --b: 1;
      --timing: ${timing_opening};
    }
    &.closed {
      --a: 1;
      --b: 0;
      --timing: ${timing_closing};
    }
    --duration: ${ZOOM_DURATION_HEADER}ms;
    will-change: opacity, transform;
    animation: xxx-header var(--duration) var(--timing);
  }
}

@keyframes xxx-header {
  from {
    opacity: var(--a);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--a)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b)) translate3d(0px, 0px, 0px);
  }
}
`

function useStyle(): Readonly<RefObject<HTMLDivElement | null>> {
  const ref = useRef<HTMLDivElement>(null)

  const { open, animating } = useOpenCloseHeader()

  useEffect(() => {
    if (ref.current === null) return
    ref.current.classList.remove(animating ? 'not-animating' : 'animating')
    ref.current.classList.add(!animating ? 'not-animating' : 'animating')
    ref.current.classList.remove(open ? 'closed' : `opened`)
    ref.current.classList.add(!open ? 'closed' : `opened`)
  }, [animating, open, ref])

  return ref
}

/*
export function HeaderStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.header {
  --b: ${b};
  will-change: none;
  animation: none;
  transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
  opacity: var(--b);
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = open ? timing_opening : timing_closing

    return (
      <>{`
.header {
  --a: ${a};
  --b: ${b};
  --timing: ${t};
  --duration: ${ZOOM_DURATION_HEADER}ms;
  will-change: opacity, transform;
  animation: xxx-header var(--duration) var(--timing);
}
`}</>
    )
  }
}
*/

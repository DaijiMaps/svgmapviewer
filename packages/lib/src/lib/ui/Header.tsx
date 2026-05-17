/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

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
import { useOpenCloseHeaderStyle } from './ui-react'
import { uiSend } from './ui-xstate'

export function Header(): ReactNode {
  useShadowRoot('header', <HeaderRoot />, 'ui')

  return <div id="header" />
}

function HeaderRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useOpenCloseHeaderStyle(ref)

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
  & h1,
  & h2,
  & p {
    ${user_select_none}
    ${pointer_events_initial}
  }
  & h1,
  & h2 {
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
    will-change: initial;
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

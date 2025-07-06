/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import {
  flex_column_center_center,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from './lib/css'
import { useShadowRoot } from './lib/dom'
import { touchSendCancel } from './lib/touch-xstate'
import { uiSend, useOpenCloseHeader } from './lib/ui-xstate'
import { viewerSend } from './lib/viewer-xstate'

export function Header(): ReactNode {
  useShadowRoot('header', <HeaderContent />, 'ui')

  return <div id="header" />
}

function HeaderContent(): ReactNode {
  const config = svgMapViewerConfig

  return (
    <div
      className="ui-content header"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'HEADER.ANIMATION.END' })}
    >
      <h1
        className="title"
        // eslint-disable-next-line functional/no-return-void
        onClick={() => doTitle()}
      >
        {config.title}
      </h1>
      <style>
        {style}
        <HeaderStyle />
      </style>
    </div>
  )
}

// eslint-disable-next-line functional/no-return-void
function doTitle() {
  viewerSend({ type: 'LAYOUT.RESET' })
  touchSendCancel()
}

const style = `
.header {
  ${position_absolute_left_0_top_0}
  ${flex_column_center_center}
  padding: 0.5em;
  font-size: smaller;
  pointer-events: none;
}

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
}
`

export function HeaderStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.header {
  --b: ${b};
  transform-origin: 50% 0%;
  opacity: var(--b);
  transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
  will-change: opacity, transform;
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = open ? timing_opening : timing_closing

    return (
      <>{`
.header {
  --timing: ${t};
  --duration: ${ZOOM_DURATION_HEADER}ms;
  --a: ${a};
  --b: ${b};
  transform-origin: 50% 0%;
  animation: xxx-header var(--duration) var(--timing);
  will-change: opacity, transform;
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
`}</>
    )
  }
}

/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import {
  flex_column_center_center,
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  user_select_none,
} from './lib/css'
import { uiSend, useOpenCloseHeader } from './lib/ui-xstate'
import { viewerSend } from './lib/viewer-xstate'

export function Header(): ReactNode {
  const config = svgMapViewerConfig

  return (
    <div
      className="header"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'HEADER.ANIMATION.END' })}
    >
      <h1
        className="title"
        // eslint-disable-next-line functional/no-return-void
        onClick={() => viewerSend({ type: 'LAYOUT.RESET' })}
      >
        {config.title}
      </h1>
      <style>{`
@scope {
${style}
}`}</style>
    </div>
  )
}

const style = `
:scope {
  ${position_absolute_left_0_top_0}
  ${flex_column_center_center}
  padding: 0.5em;
  font-size: smaller;
  pointer-events: none;
}

:scope > * {
  pointer-events: initial;
}

:scope h1,
:scope h2,
:scope p {
  ${user_select_none}
}

:scope > h1,
:scope > h2 {
  margin: 0.25em;
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
  transform-origin: 50% 0%;
  opacity: ${b};
  transform: translate(calc(50vw - 50%), 0%) scale(${b});
  will-change: opacity, transform;
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = !open ? timing_opening : timing_closing

    return (
      <>{`
.header {
  transform-origin: 50% 0%;
  animation: xxx-header 300ms ${t};
  will-change: opacity, transform;
}

@keyframes xxx-header {
  from {
    opacity: ${a};
    transform: translate(calc(50vw - 50%), 0%) scale(${a}) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${b};
    transform: translate(calc(50vw - 50%), 0%) scale(${b}) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}

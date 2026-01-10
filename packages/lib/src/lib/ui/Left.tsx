/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import {
  flex_row_center_center,
  pointer_events_none,
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { Floors } from './Floor'
import { useOpenCloseHeader } from './ui-react'

export function Left(): ReactNode {
  useShadowRoot('left', <LeftRoot />, 'ui')

  return <div id="left" />
}

function LeftRoot(): ReactNode {
  return (
    <div className="ui-content left bottom">
      <Floors />
      <style>
        {style}
        <LeftStyle />
      </style>
    </div>
  )
}

const style = `
.left {
  ${position_absolute_left_0_top_0}
  ${flex_row_center_center}
  padding: 0.4em;
  font-size: smaller;
  ${pointer_events_none}
}

.left {
  top: initial;
  align-items: end;
}
`

export function LeftStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.left {
  --b: ${b};
  transform-origin: 0% 50%;
  opacity: var(--b);
  transform: translate(0%, calc(50vh - 50%)) scale(var(--b));
  will-change: opacity, transform;
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = open ? timing_opening : timing_closing

    return (
      <>{`
.left {
  --timing: ${t};
  --duration: ${ZOOM_DURATION_HEADER}ms;
  --a: ${a};
  --b: ${b};
  transform-origin: 0% 50%;
  animation: xxx-left var(--duration) var(--timing);
  will-change: opacity, transform;
}

@keyframes xxx-left {
  from {
    opacity: var(--a);
    transform: translate(0%, calc(50vh - 50%)) scale(var(--a)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: translate(0%, calc(50vh - 50%)) scale(var(--b)) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}

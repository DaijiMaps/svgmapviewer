/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

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
import { useHeaderStyleRef } from './style'

export function Left(): ReactNode {
  useShadowRoot('left', <LeftRoot />, 'ui')

  return <div id="left" />
}

function LeftRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useHeaderStyleRef(ref, 'left')

  return (
    <div ref={ref} className="ui-content left bottom">
      <Floors />
      <style>{style}</style>
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
  top: initial;
  align-items: end;
}
.left {
  --hh: 50vh;
  --hh: 50svh;
  transform-origin: 0% 50%;
  transform: translate(0%, calc(var(--hh) - 50%)) scale(var(--b));
  &.not-animating {
    opacity: var(--b);
    &.closed {
      --b: 0;
    }
    &.opened {
      --b: 1;
    }
  }
  &.animating {
    &.closed {
      --a: 1;
      --b: 0;
      --timing: ${timing_closing};
    }
    &.opened {
      --a: 0;
      --b: 1;
      --timing: ${timing_opening};
    }
    --duration: ${ZOOM_DURATION_HEADER}ms;
    will-change: opacity, transform;
    animation: xxx-left var(--duration) var(--timing) forwards;
  }
}
@keyframes xxx-left {
  from {
    opacity: var(--a);
    transform: translate(0%, calc(var(--hh) - 50%)) scale(var(--a));
  }
  to {
    opacity: var(--b);
    transform: translate(0%, calc(var(--hh) - 50%)) scale(var(--b));
  }
}
`

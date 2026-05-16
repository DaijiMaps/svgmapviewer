/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

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
  const ref = useStyle()

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
  
  &.not-animating {
    &.opened {
      --b: 1;
    }
    &.closed {
      --b: 0;
    }
    transform-origin: 0% 50%;
    opacity: var(--b);
    transform: translate(0%, calc(50vh - 50%)) scale(var(--b));
    will-change: opacity, transform;
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
    transform-origin: 0% 50%;
    animation: xxx-left var(--duration) var(--timing);
    will-change: opacity, transform;
  }
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

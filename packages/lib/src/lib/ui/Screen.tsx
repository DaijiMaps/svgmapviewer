/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useRef, type ReactNode } from 'react'

import {
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  width_100vw_height_100svh,
  Z_INDEX_SHADOW,
  ZOOM_DURATION_DETAIL,
} from '../css'
import { useShadowRoot } from '../dom'
import { notifyUi } from '../event-ui'
import { useAnimationStyleRef } from '../viewer/layout/style'
import { useTouchMoveZoomingLock } from '../viewer/touch/event'
import { useOnWheel } from '../wheel'
import { useDetailStyleRef } from './style'

export function Screen(): ReactNode {
  useShadowRoot('screen', <ScreenRoot />, 'ui')
  return <div id="screen" />
}

function ScreenRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useDetailStyleRef(ref, 'screen')
  useAnimationStyleRef(ref, 'screen')
  useTouchMoveZoomingLock(ref)
  useOnWheel(ref)
  return (
    <div
      ref={ref}
      className="ui-content screen"
      onClick={() => notifyUi.close()}
    >
      <style>{style}</style>
    </div>
  )
}

const style = `
.screen {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  background-color: none;
  cursor: default;
  pointer-events: none;
  z-index: ${Z_INDEX_SHADOW};
  &.not-animating {
    &.closed {
      opacity: 0;
      display: none;
      &.zooming {
        display: initial;
      }
    }
    &.opened {
      pointer-events: initial;
      opacity: 0.3;
    }
  }
  &.animating {
    &.closed {
      --a: 0.3;
      --b: 0;
      --timing: ${timing_closing};
    }
    &.opened {
      --a: 0;
      --b: 0.3;
      --timing: ${timing_opening};
    }
    --duration: ${ZOOM_DURATION_DETAIL}ms;
    will-change: opacity;
    animation: xxx-screen var(--duration) var(--timing);
  }
}
@keyframes xxx-screen {
  from {
    opacity: var(--a);
  }
  to {
    opacity: var(--b);
  }
}
`

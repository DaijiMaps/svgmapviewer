/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, useRef, type ReactNode } from 'react'

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
import { useAnimating } from '../style/style-react'
import { useOnWheel } from '../wheel'
import { useOpenCloseDetailStyle } from './ui-react'

export function Screen(): ReactNode {
  useShadowRoot('screen', <ScreenRoot />, 'ui')

  return <div id="screen" />
}

function ScreenRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useOpenCloseDetailStyle(ref)

  useOnWheel(ref)

  const zooming = useAnimating()

  useEffect(() => {
    if (ref.current === null) return
    if (zooming) {
      ref.current.classList.add('zooming')
      ref.current.classList.remove('not-zooming')
    } else {
      ref.current.classList.remove('zooming')
      ref.current.classList.add('not-zooming')
    }
  }, [ref, zooming])

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
  background-color: black;
  cursor: default;
  pointer-events: initial;
  z-index: ${Z_INDEX_SHADOW};
  will-change: opacity;

  &.not-animating {
    &.opened {
    }
    &.closed {
      &.not-zooming {
        display: none;
      }
      &.zooming {
        display: initial;
        opacity: 0;
      }
    }
    opacity: 0.3;
    will-change: opacity;
  }
  &.animating {
    &.opened {
      --a: 0;
      --b: 0.3;
      --timing: ${timing_opening};
    }
    &.closed {
      --a: 0.3;
      --b: 0;
      --timing: ${timing_closing};
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

/*
export function ScreenStyle(): ReactNode {
  const { open, animating } = useOpenCloseDetail()
  const zooming = useAnimating()

  if (!animating) {
    return !open ? (
      !zooming ? (
        <>{`.screen { display: none; }`}</>
      ) : (
        // protect scroll during zoom animation
        // (changing overflow of viewer is expensive)
        <>{`.screen { display: initial; opacity: 0; }`}</>
      )
    ) : (
      <>
        {`
.screen {
  opacity: 0.3;
  will-change: opacity;
}
`}
      </>
    )
  } else {
    const [a, b] = !open ? [0.3, 0] : [0, 0.3]
    const t = open ? timing_opening : timing_closing

    return (
      <>
        {`
.screen {
  --duration: ${ZOOM_DURATION_DETAIL}ms;
  --timing: ${t};
  --a: ${a};
  --b: ${b};
  will-change: opacity;
  animation: xxx-screen var(--duration) var(--timing);
}
`}
      </>
    )
  }
}
*/

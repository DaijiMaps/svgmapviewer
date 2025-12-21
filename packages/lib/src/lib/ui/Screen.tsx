/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import {
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  width_100vw_height_100svh,
  Z_INDEX_SHADOW,
  ZOOM_DURATION_DETAIL,
} from '../css'
import { useShadowRoot } from '../dom'
import { notifyUiClose } from '../event-ui'
import { useAnimating } from '../style/style-react'
import { useOnWheel } from '../wheel'
import { useOpenCloseDetail } from './ui-react'

export function Screen(): ReactNode {
  useShadowRoot('screen', <ScreenRoot />, 'ui')

  return <div id="screen" />
}

function ScreenRoot(): ReactNode {
  const ref = useOnWheel()

  return (
    <div
      ref={ref}
      className="ui-content screen"
      onClick={() => notifyUiClose()}
    >
      <style>
        {style}
        <ScreenStyle />
      </style>
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
}
`

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

@keyframes xxx-screen {
  from {
    opacity: var(--a);
  }
  to {
    opacity: var(--b);
  }
}
`}
      </>
    )
  }
}

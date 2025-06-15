/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { notifyUiClose } from './lib/config-xstate'
import {
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  width_100vw_height_100svh,
  Z_INDEX_SHADOW,
  ZOOM_DURATION_DETAIL,
} from './lib/css'
import { useAnimating } from './lib/style-xstate'
import { useOpenCloseDetail } from './lib/ui-xstate'

export function Shadow(): ReactNode {
  return (
    <div
      className="ui-content shadow"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => notifyUiClose()}
      //// eslint-disable-next-line functional/no-return-void
      //onAnimationEnd={() => uiSend({ type: 'SHADOW.ANIMATION.END' })}
    >
      <style>
        {style}
        <ShadowStyle />
      </style>
    </div>
  )
}

const style = `
.shadow {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  background-color: black;
  cursor: default;
  pointer-events: initial;
  z-index: ${Z_INDEX_SHADOW};
  will-change: opacity;
}
`

export function ShadowStyle(): ReactNode {
  const { open, animating } = useOpenCloseDetail()
  const zooming = useAnimating()

  if (!animating) {
    return !open ? (
      !zooming ? (
        <>{`.shadow { display: none; }`}</>
      ) : (
        // protect scroll during zoom animation
        // (changing overflow of viewer is expensive)
        <>{`.shadow { display: initial; opacity: 0; } `}</>
      )
    ) : (
      <>
        {`
.shadow {
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
.shadow {
  pointer-events: none;
  will-change: opacity;
  animation: xxx-shadow ${ZOOM_DURATION_DETAIL}ms ${t};
}

@keyframes xxx-shadow {
  from {
    opacity: ${a};
  }
  to {
    opacity: ${b};
  }
}
`}
      </>
    )
  }
}

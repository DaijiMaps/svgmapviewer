/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { notifyUiClose } from './lib/config-xstate'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from './lib/css'
import { useAnimating } from './lib/style-xstate'
import { uiSend, useOpenCloseShadow } from './lib/ui-xstate'

export function Shadow(): ReactNode {
  return (
    <div
      className="shadow"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => notifyUiClose()}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'SHADOW.ANIMATION.END' })}
    >
      <style>{style}</style>
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
}
`

export function ShadowStyle(): ReactNode {
  const { open, animating } = useOpenCloseShadow()
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
    const t = open
      ? 'cubic-bezier(0.25, 0.25, 0.25, 1)'
      : 'cubic-bezier(0.75, 0, 0.75, 0.75)'

    return (
      <>
        {`
.shadow {
  will-change: opacity;
  animation: xxx-shadow 300ms ${t};
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

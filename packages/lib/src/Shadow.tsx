/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { notifyUiClose } from './lib/config-xstate'
import {
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from './lib/css'
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
      <style>{`@scope { ${style} }`}</style>
    </div>
  )
}

const style = `
:scope {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  background-color: black;
  cursor: default;
  pointer-events: initial !important;
}
`

export function ShadowStyle(): ReactNode {
  const { open, animating } = useOpenCloseShadow()

  if (!animating) {
    return !open ? (
      <>{`.shadow { display: none; }`}</>
    ) : (
      <>
        {`
.shadow {
  opacity: 0.3;
  will-change: opacity;
}`}
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

import { type ReactNode } from 'react'
import './Shadow.css'
import { notifyUiClose } from './lib/config-xstate'
import { uiSend, useOpenCloseShadow } from './lib/ui-xstate'

export function Shadow(): ReactNode {
  return (
    <div
      className="shadow"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => notifyUiClose()}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'SHADOW.ANIMATION.END' })}
    />
  )
}

export function ShadowStyle(): ReactNode {
  const shadow = useOpenCloseShadow()

  if (!shadow.animating) {
    return !shadow.open ? (
      <>{`.shadow { display: none; }`}</>
    ) : (
      <>{`.shadow { opacity: 0.3; } `}</>
    )
  } else {
    const dir = shadow.open ? '' : 'reverse'

    return (
      <>
        {`
.shadow {
  will-change: opacity;
  animation: xxx-shadow ${dir} 300ms ease;
  transform: translate3d(0px, 0px, 0px);
}

@keyframes xxx-shadow {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.3;
  }
}
`}
      </>
    )
  }
}

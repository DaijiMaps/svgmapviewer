import { useSelector } from '@xstate/react'
import { useContext } from 'react'
import { selectOpenCloseShadow, uiActor } from './lib/ui-xstate'
import { SvgMapViewerConfigContext } from './Root'
import './Shadow.css'

export function Shadow() {
  const config = useContext(SvgMapViewerConfigContext)

  return (
    <div
      className="shadow"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => config.uiCloseCbs.forEach((cb) => cb())}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiActor.send({ type: 'SHADOW.ANIMATION.END' })}
    >
      <ShadowStyle />
    </div>
  )
}

function ShadowStyle() {
  const shadow = useSelector(uiActor, selectOpenCloseShadow)

  if (!shadow.animating) {
    return !shadow.open ? (
      <style>{`.shadow { display: none; }`}</style>
    ) : (
      <style>{`.shadow { opacity: 0.3; } `}</style>
    )
  } else {
    const dir = shadow.open ? '' : 'reverse'

    return (
      <style>
        {`
.shadow {
  will-change: opacity;
  animation: xxx-shadow ${dir} 300ms ease;
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
      </style>
    )
  }
}

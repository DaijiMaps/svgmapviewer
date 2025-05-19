import { useSelector } from '@xstate/react'
import { useContext } from 'react'
import { selectOpenCloseShadow, UiRef } from './lib/ui-xstate'
import { SvgMapViewerConfigContext } from './Root'
import './Shadow.css'

export interface ShadowProps {
  _uiRef: UiRef
}

export function Shadow(props: Readonly<ShadowProps>) {
  const config = useContext(SvgMapViewerConfigContext)

  const { _uiRef: uiRef } = props

  return (
    <div
      className="shadow"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => config.uiCloseCbs.forEach((cb) => cb())}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiRef.send({ type: 'SHADOW.ANIMATION.END' })}
    >
      <ShadowStyle {...props} />
    </div>
  )
}

function ShadowStyle(props: Readonly<ShadowProps>) {
  const { _uiRef: uiRef } = props

  const shadow = useSelector(uiRef, selectOpenCloseShadow)

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

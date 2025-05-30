import { type ReactNode, useContext } from 'react'
import './Header.css'
import { SvgMapViewerConfigContext } from './Root'
import { uiSend, useOpenCloseHeader } from './lib/ui-xstate'
import { viewerSend } from './lib/viewer-xstate'

export function Header(): ReactNode {
  const config = useContext(SvgMapViewerConfigContext)

  return (
    <div
      className="header"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'HEADER.ANIMATION.END' })}
    >
      <h1
        className="title"
        // eslint-disable-next-line functional/no-return-void
        onClick={() => viewerSend({ type: 'LAYOUT.RESET' })}
      >
        {config.title}
      </h1>
    </div>
  )
}

export function HeaderStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.header {
  transform-origin: 50% 0%;
  opacity: ${b};
  transform: translate(calc(50vw - 50%), 0%) scale(${b});
  will-change: opacity transform;
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = !open
      ? 'cubic-bezier(0.25, 0.25, 0.25, 1)'
      : 'cubic-bezier(0.75, 0, 0.75, 0.75)'

    return (
      <>{`
.header {
  transform-origin: 50% 0%;
  animation: xxx-header 300ms ${t};
  will-change: opacity transform;
}

@keyframes xxx-header {
  from {
    opacity: ${a};
    transform: translate(calc(50vw - 50%), 0%) scale(${a}) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${b};
    transform: translate(calc(50vw - 50%), 0%) scale(${b}) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}

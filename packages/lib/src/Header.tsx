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
      <h2 className="subtitle">{config.subtitle}</h2>
      <h1
        className="title"
        // eslint-disable-next-line functional/no-return-void
        onClick={() => viewerSend({ type: 'LAYOUT.RESET' })}
      >
        {config.title}
      </h1>
      <HeaderStyle />
    </div>
  )
}

export function HeaderStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <style>{`
.header {
  transform-origin: 50% 0%;
  opacity: ${b};
  transform: scale(${b});
}
`}</style>
    )
  } else {
    const dir = !open ? '' : 'reverse'

    return (
      <style>{`
.header {
  transform-origin: 50% 0%;
  animation: xxx-header 300ms ease ${dir};
  will-change: opacity transform;
}

@keyframes xxx-header {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
}
`}</style>
    )
  }
}

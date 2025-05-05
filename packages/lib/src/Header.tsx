import { useSelector } from '@xstate/react'
import { useContext } from 'react'
import './Header.css'
import { LayersButtons } from './Layers'
import { PointerRef } from './lib/pointer-xstate'
import { selectOpenCloseHeader, UiRef } from './lib/ui-xstate'
import { SvgMapViewerConfigContext } from './Root'

interface HeaderProps {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export const Header = (props: Readonly<HeaderProps>) => {
  const { _uiRef: uiRef, _pointerRef: pointerRef } = props
  const config = useContext(SvgMapViewerConfigContext)

  return (
    <div
      className="header"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiRef.send({ type: 'HEADER.ANIMATION.END' })}
    >
      <h2>{config.subtitle}</h2>
      <h1
        // eslint-disable-next-line functional/no-return-void
        onClick={() => pointerRef.send({ type: 'LAYOUT.RESET' })}
      >
        {config.title}
      </h1>
      <LayersButtons />
    </div>
  )
}

export function HeaderStyle(props: Readonly<HeaderProps>) {
  const { _uiRef: uiRef } = props

  const { open, animating } = useSelector(uiRef, selectOpenCloseHeader)

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
    const a = !open ? 1 : 0
    const b = !open ? 0 : 1

    return (
      <style>{`
.header {
  transform-origin: 50% 0%;
  animation: xxx-header 300ms ease;
  will-change: opacity transform;
}

@keyframes xxx-header {
  from {
    opacity: ${a};
    transform: scale(${a});
  }
  to {
    opacity: ${b};
    transform: scale(${b});
  }
}
`}</style>
    )
  }
}

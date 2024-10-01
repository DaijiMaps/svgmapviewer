import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import './Footer.css'
import { selectMode } from './lib/react-pointer'
import { selectOpenCloseFooter } from './lib/react-ui'
import { PointerRef } from './lib/xstate-pointer'
import { UiRef } from './lib/xstate-ui'
import { SvgMapViewerConfigContext } from './svgmapviewer'

interface FooterProps {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export const Footer = (props: Readonly<FooterProps>) => {
  const { _uiRef: uiRef, _pointerRef: pointerRef } = props
  const config = useContext(SvgMapViewerConfigContext)
  const mode = useSelector(pointerRef, selectMode)

  const sendModePointing = useCallback(
    // eslint-disable-next-line functional/no-return-void
    () => pointerRef.send({ type: 'MODE', mode: 'pointing' }),
    [pointerRef]
  )
  const sendModePanning = useCallback(
    // eslint-disable-next-line functional/no-return-void
    () => pointerRef.send({ type: 'MODE', mode: 'panning' }),
    [pointerRef]
  )

  return (
    <div
      className="footer"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => pointerRef.send({ type: 'DEBUG' })}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiRef.send({ type: 'FOOTER.ANIMATION.END' })}
    >
      <div className="mode">
        <div
          className={clsx(
            'mode-item',
            'pointing',
            mode === 'pointing' && 'selected'
          )}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => sendModePointing()}
        >
          <span>pointing</span>
        </div>
        <div
          className={clsx(
            'mode-item',
            'panning',
            mode === 'panning' && 'selected'
          )}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => sendModePanning()}
        >
          <span>panning</span>
        </div>
      </div>
      <p>{config.copyright}</p>
    </div>
  )
}

export function FooterStyle(props: Readonly<FooterProps>) {
  const { _uiRef: uiRef } = props

  const { open, animating } = useSelector(uiRef, selectOpenCloseFooter)

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <style>{`
.footer {
  transform-origin: 50% 100%;
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
.footer {
  transform-origin: 50% 100%;
  animation: xxx-footer 300ms ease;
  will-change: opacity transform;
}

@keyframes xxx-footer {
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

import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import { useCallback, useContext } from 'react'
import './Footer.css'
import { PointerRef, selectMode } from './lib/pointer-xstate'
import { selectOpenCloseFooter, UiRef } from './lib/ui-xstate'
import { SvgMapViewerConfigContext } from './Root'

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
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={pointingPath} />
          </svg>
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
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={panningPath} />
          </svg>
        </div>
      </div>
      <p
        // eslint-disable-next-line functional/no-return-void
        onClick={() => pointerRef.send({ type: 'DEBUG' })}
      >
        {config.copyright}
      </p>
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

const pointingPath = `
M0,0
L-1,3
L-5,-5
L3,-1
Z
M-5,-5
L5,5
`

const panningPath = `
M0,5
V-5
M5,0
H-5
M5,0
m-2,-1
l2,1
l-2,1
M-5,0
m2,1
l-2,-1
l2,-1
M0,5
m1,-2
l-1,2
l-1,-2
M0,-5
m-1,2
l1,-2
l1,2
`

import { type ReactNode, useContext } from 'react'
import './Footer.css'
import { uiSend, useOpenCloseFooter } from './lib/ui-xstate'
import { SvgMapViewerConfigContext } from './Root'

export function Footer(): ReactNode {
  const config = useContext(SvgMapViewerConfigContext)
  //const mode = useSelector(viewerActor, selectMode)

  //const vecs = useTouchesVecs()
  //const z = useTouchesZ()

  return (
    <div
      className="footer"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'FOOTER.ANIMATION.END' })}
    >
      {/*
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
      */}
      {/*
      <p>{`v=${vecs.size};z=${z};touching=${touching}`}</p>
      */}
      <p>{config.copyright}</p>
    </div>
  )
}

/*
const sendModePointing =
  // eslint-disable-next-line functional/no-return-void
  () => viewerActor.send({ type: 'MODE', mode: 'pointing' })
const sendModePanning =
  // eslint-disable-next-line functional/no-return-void
  () => viewerActor.send({ type: 'MODE', mode: 'panning' })
*/

export function FooterStyle(): ReactNode {
  const { open, animating } = useOpenCloseFooter()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.footer {
  transform-origin: 50% 100%;
  opacity: ${b};
  transform: scale(${b});
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
.footer {
  transform-origin: 50% 100%;
  animation: xxx-footer 300ms ${t};
  will-change: opacity transform;
}

@keyframes xxx-footer {
  from {
    opacity: ${a};
    transform: scale(${a}) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${b};
    transform: scale(${b}) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}

/*
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
*/

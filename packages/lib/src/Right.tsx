import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import './Right.css'
import { pointerActor } from './lib/pointer-react'
import { selectOpenCloseRight, UiRef } from './lib/ui-xstate'

interface RightProps {
  _uiRef: UiRef
}

export const Right = (props: Readonly<RightProps>) => {
  const { _uiRef: uiRef } = props

  return (
    <div
      className="right"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiRef.send({ type: 'RIGHT.ANIMATION.END' })}
    >
      <div className="zoom">
        <div
          className={clsx('zoom-item')}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => sendZoomOut()}
        >
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={zoomOutPath} />
          </svg>
        </div>
        <div
          className={clsx('zoom-item')}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => sendZoomIn()}
        >
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={zoomInPath} />
          </svg>
        </div>
      </div>
    </div>
  )
}

const sendZoomOut =
  // eslint-disable-next-line functional/no-return-void
  () => pointerActor.send({ type: 'ZOOM.ZOOM', z: -1 })
const sendZoomIn =
  // eslint-disable-next-line functional/no-return-void
  () => pointerActor.send({ type: 'ZOOM.ZOOM', z: 1 })

export function RightStyle(props: Readonly<RightProps>) {
  const { _uiRef: uiRef } = props

  const { open, animating } = useSelector(uiRef, selectOpenCloseRight)

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <style>{`
.right {
  transform-origin: 100% 50%;
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
.right {
  transform-origin: 100% 50%;
  animation: xxx-right 300ms ease;
  will-change: opacity transform;
}

@keyframes xxx-right {
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

const zoomInPath = `
M0,0
m5,5
l-2,-2
a3,3 0,1,1 -6,-6
a3,3 0,1,1 6,6
m-3-3
m-2.5,0
h5
m-2.5,-2.5
v5
`

const zoomOutPath = `
M0,0
m5,5
l-2,-2
a3,3 0,1,1 -6,-6
a3,3 0,1,1 6,6
m-3-3
m-2.5,0
h5
`

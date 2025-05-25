import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import './Right.css'
import { pointerActor } from './lib/pointer-react'
import { selectOpenCloseRight, uiActor } from './lib/ui-xstate'

export const Right = () => {
  return (
    <div
      className="right bottom"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiActor.send({ type: 'RIGHT.ANIMATION.END' })}
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
      <RightStyle />
    </div>
  )
}

const sendZoomOut =
  // eslint-disable-next-line functional/no-return-void
  () => pointerActor.send({ type: 'ZOOM.ZOOM', z: -1, p: null })
const sendZoomIn =
  // eslint-disable-next-line functional/no-return-void
  () => pointerActor.send({ type: 'ZOOM.ZOOM', z: 1, p: null })

export function RightStyle() {
  const { open, animating } = useSelector(uiActor, selectOpenCloseRight)

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <style>{`
.right {
  transform-origin: 100% 50%;
  opacity: ${b};
  transform: scale(${b});
}
.bottom {
  transform-origin: 100% 100%;
}
`}</style>
    )
  } else {
    const dir = !open ? '' : 'reverse'

    return (
      <style>{`
.right {
  transform-origin: 100% 50%;
  animation: xxx-right 300ms ease ${dir};
  will-change: opacity transform;
}
.bottom {
  transform-origin: 100% 100%;
}

@keyframes xxx-right {
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

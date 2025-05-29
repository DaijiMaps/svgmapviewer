import { type ReactNode } from 'react'
//import clsx from 'clsx/clsx'
import './Right.css'
import { uiSend, useOpenCloseRight } from './lib/ui-xstate'
import { viewerSend } from './lib/viewer-xstate'

export function Right(): ReactNode {
  return (
    <div
      className="right bottom"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'RIGHT.ANIMATION.END' })}
    >
      <div className="zoom">
        <div
          className={'zoom-item'}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => viewerSend({ type: 'RECENTER' })}
        >
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={panningPath} />
          </svg>
        </div>
        <div
          className={'zoom-item'}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => viewerSend({ type: 'ZOOM.ZOOM', z: -1, p: null })}
        >
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={zoomOutPath} />
          </svg>
        </div>
        <div
          className={'zoom-item'}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => viewerSend({ type: 'ZOOM.ZOOM', z: 1, p: null })}
        >
          <svg viewBox="-5.25 -5.25 10.5 10.5">
            <path d={zoomInPath} />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function RightStyle(): ReactNode {
  const { open, animating } = useOpenCloseRight()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.right {
  transform-origin: 100% 50%;
  opacity: ${b};
  /*
  transform: scale(${b});
  */
  will-change: opacity transform;
}
.bottom {
  transform-origin: 100% 100%;
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
.right {
  transform-origin: 100% 50%;
  animation: xxx-right 300ms ${t};
  will-change: opacity transform;
}
.bottom {
  transform-origin: 100% 100%;
}

@keyframes xxx-right {
  from {
    opacity: ${a};
    /*
    transform: scale(${a}) translate3d(0px, 0px, 0px);
    */
  }
  to {
    opacity: ${b};
    /*
    transform: scale(${b}) translate3d(0px, 0px, 0px);
    */
  }
}
`}</>
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

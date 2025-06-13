/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import {
  flex_column_center_center,
  flex_row_center_center,
  pointer_events_initial,
  pointer_events_none,
  position_absolute_right_0_top_0,
} from './lib/css'
import { getPosition } from './lib/geo'
import { uiSend, useOpenCloseRight } from './lib/ui-xstate'
import { viewerSend } from './lib/viewer-xstate'

export function Right(): ReactNode {
  return (
    <div
      className="right bottom"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'RIGHT.ANIMATION.END' })}
    >
      <Zoom />
      <style>{style}</style>
    </div>
  )
}

const style = `
.right {
  ${position_absolute_right_0_top_0}
  ${flex_row_center_center}
  padding: 0.4em;
  font-size: smaller;
  ${pointer_events_none}

  transform-origin: 100% 50%;
}

.right {
  top: initial;
  bottom: 0;
  align-items: end;

  transform-origin: 100% 100%;
}
`

function Zoom(): ReactNode {
  return (
    <div className="zoom">
      <Position />
      <Recenter />
      <ZoomOut />
      <ZoomIn />
      <style>{zoomStyle}</style>
    </div>
  )
}

const zoomStyle = `
.zoom {
  font-size: large;
  margin: 0;
  ${flex_column_center_center}
}

.zoom-item {
  margin: 1.6px;
  padding: 0.4em;
  border: 1.6px black solid;
  ${pointer_events_initial}
}
.zoom-item > svg {
  display: block;
  width: 1.6em;
  height: 1.6em;
  pointer-events: none;
}
.zoom-item > svg > path {
  stroke: black;
  stroke-width: 0.4;
  fill: none;
}
`

function Position() {
  return (
    <div
      className={'zoom-item'}
      // eslint-disable-next-line functional/no-return-void
      onClick={() => getPosition()}
    >
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={positionPath} />
      </svg>
    </div>
  )
}

function Recenter() {
  return (
    <div
      className={'zoom-item'}
      // eslint-disable-next-line functional/no-return-void
      onClick={() => viewerSend({ type: 'RECENTER' })}
    >
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={panningPath} />
      </svg>
    </div>
  )
}

function ZoomOut() {
  return (
    <div
      className={'zoom-item'}
      // eslint-disable-next-line functional/no-return-void
      onClick={() => viewerSend({ type: 'ZOOM.ZOOM', z: -1, p: null })}
    >
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={zoomOutPath} />
      </svg>
    </div>
  )
}

function ZoomIn() {
  return (
    <div
      className={'zoom-item'}
      // eslint-disable-next-line functional/no-return-void
      onClick={() => viewerSend({ type: 'ZOOM.ZOOM', z: 1, p: null })}
    >
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={zoomInPath} />
      </svg>
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
  will-change: opacity, transform;
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
  will-change: opacity, transform;
}
.bottom {
  transform-origin: 100% 100%;
}

@keyframes xxx-right {
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

// XXX
// XXX
// XXX
const r = 4
const h = r / Math.sqrt(2)
const y = h + r / 4
const positionPath = `
m 0,1
m 0,${y}
l ${-h},${-h}
a ${r},${r} 0,1,1 ${2 * h},0
z
m 0,${-y}
a ${r / 2},${r / 2} 0,1,0 0,${-r}
a ${r / 2},${r / 2} 0,1,0 0,${r}
`.replaceAll(/([.]\d\d)\d*/g, '$1')
// XXX
// XXX
// XXX

/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from '..'
import {
  uiActionFullscreenCbs,
  uiActionPositionCbs,
  uiActionRecenterCbs,
  uiActionZoomInCbs,
  uiActionZoomOutCbs,
} from '../config'
import {
  flex_column_center_center,
  flex_row_center_center,
  pointer_events_initial,
  pointer_events_none,
  position_absolute_right_0_top_0,
  timing_closing,
  timing_opening,
} from '../css'
import { useShadowRoot } from '../dom'
import { useOpenCloseHeader } from './ui-xstate'

export function Right(): ReactNode {
  useShadowRoot('right', <RightContent />, 'ui')

  return <div id="right" />
}

function RightContent(): ReactNode {
  return (
    <div className="ui-content right bottom">
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
      <Fullscreen />
      <Position />
      <Recenter />
      <ZoomOut />
      <ZoomIn />
      <style>
        {zoomStyle}
        <RightStyle />
      </style>
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
  cursor: default;
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

.fullscreen {
  display: none;
}
`

function Fullscreen() {
  return (
    <div className={'zoom-item fullscreen'} onClick={() => doFullscreen()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={fullscreenPath} />
      </svg>
    </div>
  )
}

function Position() {
  return svgMapViewerConfig.mapCoord.matrix.isIdentity ? (
    <></>
  ) : (
    <div className={'zoom-item position'} onClick={() => doPosition()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={positionPath} />
      </svg>
    </div>
  )
}

function Recenter() {
  return (
    <div className={'zoom-item recenter'} onClick={() => doRecenter()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={panningPath} />
      </svg>
    </div>
  )
}

function ZoomOut() {
  return (
    <div className={'zoom-item zoom-out'} onClick={() => doZoomOut()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={zoomOutPath} />
      </svg>
    </div>
  )
}

function ZoomIn() {
  return (
    <div className={'zoom-item zoom-in'} onClick={() => doZoomIn()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={zoomInPath} />
      </svg>
    </div>
  )
}

function doFullscreen() {
  uiActionFullscreenCbs.forEach((cb) => cb())
}

function doPosition() {
  uiActionPositionCbs.forEach((cb) => cb())
}

function doRecenter() {
  uiActionRecenterCbs.forEach((cb) => cb())
}

function doZoomOut() {
  uiActionZoomOutCbs.forEach((cb) => cb())
}

function doZoomIn() {
  uiActionZoomInCbs.forEach((cb) => cb())
}

export function RightStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.right {
  --b: ${b};
  transform-origin: 100% 50%;
  opacity: var(--b);
  /*
  transform: scale(var(--b));
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
    const t = open ? timing_opening : timing_closing

    return (
      <>{`
.right {
  --timing: ${t};
  --a: ${a};
  --b: ${b};
  transform-origin: 100% 50%;
  animation: xxx-right 300ms var(--timing);
  will-change: opacity, transform;
}
.bottom {
  transform-origin: 100% 100%;
}

@keyframes xxx-right {
  from {
    opacity: var(--a);
    transform: scale(var(--a)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: scale(var(--b)) translate3d(0px, 0px, 0px);
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
const h = 3
const r = h * Math.sqrt(2)
const H = r + h * 2
const y = H / 2
const positionPath = `
M 0,0
m 0,${y}
l ${-h},${-h}
a ${r},${r} 0,1,1 ${2 * h},0
z
m 0,${-H + r + r / 2}
a ${r / 2},${r / 2} 0,1,0 0,${-r}
a ${r / 2},${r / 2} 0,1,0 0,${r}
`.replaceAll(/([.]\d\d)\d*/g, '$1')
// XXX
// XXX
// XXX

const fullscreenPath = `
M0,0
m5,5
m-1,-1
h-8
v-8
h8
z
m1,-1
v-8
h-8
`

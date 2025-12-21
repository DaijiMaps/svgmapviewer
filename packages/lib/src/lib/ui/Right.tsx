/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import {
  background_white_opaque,
  flex_column_center_center,
  flex_row_center_center,
  pointer_events_initial,
  pointer_events_none,
  position_absolute_right_0_top_0,
  timing_closing,
  timing_opening,
} from '../css'
import { useShadowRoot } from '../dom'
import { Fullscreen } from './buttons/Fullscreen'
import { Position } from './buttons/Position'
import { Recenter } from './buttons/Recenter'
import { Rotate } from './buttons/Rotate'
import { ZoomIn } from './buttons/ZoomIn'
import { ZoomOut } from './buttons/ZoomOut'
import { useOpenCloseHeader } from './ui-react'

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
      <Rotate />
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
  margin: 1.25px;
  padding: 0.25em;
  border: 1.25px black solid;
  ${pointer_events_initial}
  cursor: default;
  ${background_white_opaque}
}
.zoom-item > svg {
  display: block;
  width: 1.25em;
  height: 1.25em;
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

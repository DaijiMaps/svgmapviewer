/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

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
import { Home } from './buttons/Home'
import { Position } from './buttons/Position'
import { Recenter } from './buttons/Recenter'
import { Rotate } from './buttons/Rotate'
import { ZoomIn } from './buttons/ZoomIn'
import { ZoomOut } from './buttons/ZoomOut'
import { useOpenCloseHeaderStyle } from './ui-react'

export function Right(): ReactNode {
  useShadowRoot('right', <RightRoot />, 'ui')

  return <div id="right" />
}

function RightRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useOpenCloseHeaderStyle(ref)

  return (
    <div ref={ref} className="ui-content right bottom">
      <Buttons />
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

  top: initial;
  bottom: 0;
  align-items: end;

  transform-origin: 100% 50%;
  &.bottom {
    transform-origin: 100% 100%;
  }
  
  &.not-animating {
    &.opened {
      --b: 1;
    }
    &.closed {
      --b: 0;
    }
    opacity: var(--b);
    /*
    transform: scale(var(--b));
    will-change: initial;
    */
  }
  &.animating {
    &.opened {
      --a: 0;
      --b: 1;
      --timing: ${timing_opening};
    }
    &.closed {
      --a: 1;
      --b: 0;
      --timing: ${timing_closing};
    }
    animation: xxx-right 300ms var(--timing);
    will-change: opacity, transform;
  }
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
`

function Buttons(): ReactNode {
  return (
    <div className="button">
      <Position />
      <Home />
      <Fullscreen />
      <Recenter />
      <Rotate />
      <ZoomOut />
      <ZoomIn />
      <style>{buttonStyle}</style>
    </div>
  )
}

const buttonStyle = `
.button {
  font-size: large;
  margin: 0;
  ${flex_column_center_center}
}

.button-item {
  margin: 1.25px;
  padding: 0.25em;
  border: 1.25px black solid;
  ${pointer_events_initial}
  cursor: default;
  ${background_white_opaque}
  & > svg {
    display: block;
    width: 1.25em;
    height: 1.25em;
    pointer-events: none;
    & > path {
      stroke: black;
      stroke-width: 0.4;
      fill: none;
    }
  }
}

.fullscreen {
  display: none;
}
`

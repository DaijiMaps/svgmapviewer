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
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { useStyleRef } from '../style/ref'
import { scrollLockRefs } from '../viewer/scroll/scroll'
import { Fullscreen } from './buttons/Fullscreen'
import { Home } from './buttons/Home'
import { Position } from './buttons/Position'
import { Recenter } from './buttons/Recenter'
import { Rotate } from './buttons/Rotate'
import { ZoomIn } from './buttons/ZoomIn'
import { ZoomOut } from './buttons/ZoomOut'
import { useHeaderStyleRef } from './style'

export function Right(): ReactNode {
  useShadowRoot('right', <RightRoot />, 'ui')

  return <div id="right" />
}

function RightRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useHeaderStyleRef(ref, 'right')

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
  top: initial;
  bottom: 0;
  align-items: end;
}
.right {
  transform-origin: 100% 50%;
  &.bottom {
    transform-origin: 100% 100%;
  }
  transform: translate3d(0px, 0px, 0px);
  &.not-animating {
    opacity: var(--b);
    transform: scale(var(--b));
    &.closed {
      --b: 0;
    }
    &.opened {
      --b: 1;
    }
    will-change: initial;
  }
  &.animating {
    &.closed {
      --a: 1;
      --b: 0;
      --timing: ${timing_closing};
    }
    &.opened {
      --a: 0;
      --b: 1;
      --timing: ${timing_opening};
    }
    --duration: ${ZOOM_DURATION_HEADER}ms;
    will-change: opacity, transform;
    animation: xxx-right var(--duration) var(--timing) forwards;
  }
}
@keyframes xxx-right {
  from {
    opacity: var(--a);
    transform: scale(var(--a));
  }
  to {
    opacity: var(--b);
    transform: scale(var(--b));
  }
}
`

function Buttons(): ReactNode {
  const ref = useRef(null)
  useStyleRef(scrollLockRefs, ref, 'buttons')
  return (
    <div ref={ref} className="buttons">
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
.buttons {
  font-size: large;
  margin: 0;
  ${flex_column_center_center}
  &.locked {
    & > .button-item {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
.button-item {
  margin: 1.25px;
  padding: 0.25em;
  border: 1.25px black solid;
  ${pointer_events_initial}
  cursor: default;
  ${background_white_opaque}
  transition: opacity 100ms;
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

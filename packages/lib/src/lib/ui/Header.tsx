/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { notifyFloorLock, uiActionResetCbs } from '../../event'
import {
  flex_column_center_center,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { useFloors } from '../viewer/floors-xstate'
import { uiSend, useOpenCloseHeader } from './ui-xstate'

export function Header(): ReactNode {
  useShadowRoot('header', <HeaderContent />, 'ui')

  return <div id="header" />
}

function HeaderContent(): ReactNode {
  const config = svgMapViewerConfig

  return (
    <div
      className="ui-content header"
      onAnimationEnd={() => uiSend({ type: 'HEADER.ANIMATION.END' })}
    >
      <h1 className="title" onClick={() => doTitle()}>
        {config.title}
      </h1>
      <Floors />
      <style>
        {style}
        <HeaderStyle />
      </style>
    </div>
  )
}

function Floors(): ReactNode {
  const floors = useFloors()
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return <></>
  }
  return (
    <div className="floors">
      <ul className="floor-list">
        {floorsConfig.floors.map(({ name }, fidx) => (
          <li
            key={fidx}
            className={
              'floor-item' +
              (fidx === floors.fidx || fidx === floors.newFidx
                ? ' selected'
                : ' unselected')
            }
            onClick={() => notifyFloorLock(fidx)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function doTitle() {
  uiActionResetCbs.forEach((cb) => cb())
}

const style = `
.header {
  ${position_absolute_left_0_top_0}
  ${flex_column_center_center}
  padding: 0.5em;
  font-size: smaller;
  pointer-events: none;
}

h1,
h2,
p {
  ${user_select_none}
  ${pointer_events_initial}
}

h1,
h2 {
  margin: 0.25em;
  font-weight: 100;
  cursor: default;
}

.floors {
  display: flex;
  align-items: center;
  justify-content: center;
}
.floor-list {
  margin: 0.5em;
  padding: 0;
  list-style: none;
  font-size: 2em;
  display: flex;
  flex-direction: row;
}
.floor-item {
  padding: 0.5em 0.75em;
  border: 1.5px solid black;
  pointer-events: initial;
  transition: opacity 500ms;
}
.floor-item.selected {
  opacity: 1;
}
.floor-item.unselected {
  opacity: 0.5;
}
`

export function HeaderStyle(): ReactNode {
  const { open, animating } = useOpenCloseHeader()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.header {
  --b: ${b};
  transform-origin: 50% 0%;
  opacity: var(--b);
  transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
  will-change: opacity, transform;
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = open ? timing_opening : timing_closing

    return (
      <>{`
.header {
  --timing: ${t};
  --duration: ${ZOOM_DURATION_HEADER}ms;
  --a: ${a};
  --b: ${b};
  transform-origin: 50% 0%;
  animation: xxx-header var(--duration) var(--timing);
  will-change: opacity, transform;
}

@keyframes xxx-header {
  from {
    opacity: var(--a);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--a)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b)) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}

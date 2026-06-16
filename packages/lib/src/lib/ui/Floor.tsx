/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

import { useConfig } from '../../config'
import { background_white_opaque, floor_switch_duration } from '../css'
import { useStyleRef } from '../style/ref'
import { useFloors } from '../viewer/floors/floors-react'
import { scrollLockRefs } from '../viewer/scroll/scroll'

export function Floors(): ReactNode {
  const ref = useRef(null)
  const { fidx, fidxToOnClick } = useFloors()
  const cfg = useConfig()
  useStyleRef(scrollLockRefs, ref, 'floors')
  return cfg.floorsConfig === undefined ||
    cfg.floorsConfig.floors.length < 2 ? (
    <></>
  ) : (
    <div ref={ref} className="floors">
      <ul className="floor-list">
        {cfg.floorsConfig.floors.map(({ name }, idx) => (
          <li
            key={idx}
            className={`floor-item ${s(idx === fidx)}`}
            onClick={fidxToOnClick(idx)}
          >
            {name}
          </li>
        ))}
      </ul>
      <style>{floorsStyle}</style>
    </div>
  )
}

const floorsStyle = `
.floors {
  max-width: calc(100vw - 2em);
  overflow-x: scroll;
  scrollbar-width: none;
  pointer-events: initial;
  touch-action: pan-x;
  &.locked {
    & > .floor-list {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
.floor-list {
  margin: 0.25em;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column-reverse;
  ${background_white_opaque}
  transition: opacity 100ms;
}
.floor-item {
  text-align: center;
  padding: 0.5em 0.75em;
  border: 1.5px solid black;
  pointer-events: initial;
  will-change: opacity;
  transition: opacity ${floor_switch_duration};
  &.selected {
    opacity: 1;
  }
  &.unselected {
    opacity: 0.5;
  }
}
`

export function FloorName(): ReactNode {
  const { fidx } = useFloors()
  const cfg = useConfig()
  const floorsConfig = cfg.floorsConfig
  return floorsConfig === undefined || floorsConfig.floors.length < 2 ? (
    <></>
  ) : (
    <div>
      {floorsConfig.floors.map((floor, idx) => (
        <h2 key={idx} className={`floor-name ${s(idx === fidx)}`}>
          {floor.name}
        </h2>
      ))}
      <style>{floorNameStyle}</style>
    </div>
  )
}

const floorNameStyle = `
.floor-name {
  position: absolute;
  transform: translate(-50%, 0);
  margin: 0.25em 0;
  font-size: 4em;
  will-change: opacity;
  transition: opacity ${floor_switch_duration};
  &.selected {
    opacity: 1;
  }
  &.unselected {
    opacity: 0;
  }
}
`

function s(selected: boolean): string {
  return selected ? 'selected' : 'unselected'
}

/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { notifyFloorLock } from '../../event'
import { useFloors } from '../viewer/floors-xstate'

export function Floors(): ReactNode {
  const { fidx, newFidx } = useFloors()
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return <></>
  }
  return (
    <div className="floors">
      <ul className="floor-list">
        {floorsConfig.floors.map(({ name }, idx) => (
          <li
            key={idx}
            className={
              'floor-item' +
              (idx === fidx || idx === newFidx ? ' selected' : ' unselected')
            }
            onClick={
              newFidx !== null
                ? undefined
                : idx === fidx
                  ? undefined
                  : () => notifyFloorLock(idx)
            }
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.floor-list {
  margin: 0.5em;
  padding: 0;
  list-style: none;
  font-size: 1.75em;
  display: flex;
  flex-direction: row;
}
.floor-item {
  padding: 0.5em 0.75em;
  border: 1.5px solid black;
  pointer-events: initial;
  will-change: opacity;
  transition: opacity 500ms;
}
.floor-item.selected {
  opacity: 1;
}
.floor-item.unselected {
  opacity: 0.5;
}
`

export function FloorName(): ReactNode {
  const { fidx, oldFidx, newFidx } = useFloors()
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return <></>
  }
  return (
    <div>
      {floorsConfig.floors.map((floor, idx) => (
        <h2
          key={idx}
          className={`floor-name ${isSelected(idx, fidx, oldFidx, newFidx) ? 'selected' : 'unselected'}`}
        >
          {floor.name}
        </h2>
      ))}
      <style>{floorNameStyle}</style>
    </div>
  )
}

function isSelected(
  idx: number,
  fidx: number,
  oldFidx: null | number,
  newFidx: null | number
): boolean {
  return oldFidx === null && newFidx === null ? idx === fidx : idx === newFidx
}

const floorNameStyle = `
.floor-name {
  position: absolute;
  transform: translate(-50%, 0);
  margin: 0.25em 0;
  font-size: 4em;
  will-change: opacity;
  transition: opacity 500ms;
}
.floor-name.selected {
  opacity: 1;
}
.floor-name.unselected {
  opacity: 0;
}
`

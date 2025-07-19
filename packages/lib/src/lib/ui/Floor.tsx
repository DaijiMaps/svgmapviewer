/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { useFloors } from '../viewer/floors-xstate'

export function Floors(): ReactNode {
  const { fidx, fidxToOnClick } = useFloors()
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
}
.floor-list {
  margin: 0.5em 0;
  padding: 0;
  list-style: none;
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
  const { fidx } = useFloors()
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return <></>
  }
  return (
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
  transition: opacity 500ms;
}
.floor-name.selected {
  opacity: 1;
}
.floor-name.unselected {
  opacity: 0;
}
`

function s(selected: boolean): string {
  return selected ? 'selected' : 'unselected'
}

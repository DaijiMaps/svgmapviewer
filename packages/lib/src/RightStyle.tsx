/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function RightCss(): ReactNode {
  return (
    <style>
      {`
.right {
  padding: 0.4em;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: smaller;
  pointer-events: none;

  transform-origin: 100% 50%;
}
.bottom {
  top: initial;
  bottom: 0;
  align-items: end;

  transform-origin: 100% 100%;
}

.right > * {
  pointer-events: initial;
}

.zoom {
  font-size: large;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.zoom-item {
  margin: 1.6px;
  padding: 0.4em;
  border: 1.6px black solid;
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
`}
    </style>
  )
}

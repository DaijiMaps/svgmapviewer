/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function FooterCss(): ReactNode {
  return (
    <style>
      {`
.footer {
  padding: 0.4em;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: xx-small;
  pointer-events: none;
}
.footer > p {
  margin: 0.25em;
}

.footer > * {
  pointer-events: initial;
}

.footer h2,
.footer p {
  user-select: none;
  -webkit-user-select: none;
}

.mode {
  font-size: large;
  margin: 0.4em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.mode-item {
  margin: 0 1.6px;
  padding: 0.4em;
  border: 1.6px black solid;
}
.mode-item.selected {
  pointer-events: none;
}
.mode-item:not(.selected) {
  opacity: 0.375;
}
.mode-item > svg {
  display: block;
  width: 1.6em;
  height: 1.6em;
  pointer-events: none;
}
.mode-item > svg > path {
  stroke: black;
  stroke-width: 0.4px;
  fill: none;
}

.footer > h2 {
  font-size: x-small;
  margin: 0;
}
`}
    </style>
  )
}

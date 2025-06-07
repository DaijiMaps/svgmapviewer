/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function HeaderCss(): ReactNode {
  return (
    <style>
      {`
.header {
  padding: 0.5em;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: smaller;
  pointer-events: none;
}

.header > * {
  pointer-events: initial;
}

.header h1,
.header h2,
.header p {
  -webkit-user-select: none;
  user-select: none;
}

.header > h1,
.header > h2 {
  margin: 0.25em;
  cursor: default;
}
`}
    </style>
  )
}

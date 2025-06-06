/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function DetailCss(): ReactNode {
  return (
    <style>{`
.content {
  overflow: hidden;
}

.detail {
  width: 50vmin;
  height: 50vmin;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0.5em;
  overflow: scroll;
  pointer-events: initial;
  box-sizing: border-box;
  z-index: 11;
}

.detail > h3,
.detail p {
  user-select: none;
  -webkit-user-select: none;
}

.detail > h3 {
  margin: 1.5em;
  text-align: center;
}

.detail > p {
  margin: 0.5em;
}
`}</style>
  )
}

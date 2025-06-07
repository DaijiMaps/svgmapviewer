/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function GuidesCss(): ReactNode {
  return (
    <>
      {`
.guides {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  height: 100svh;
  pointer-events: none;
  z-index: 2;
}

.distance > text,
.coordinate > text {
  user-select: none;
  -webkit-user-select: none;
}
`}
    </>
  )
}

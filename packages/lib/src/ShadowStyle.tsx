/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function ShadowCss(): ReactNode {
  return (
    <style>
      {`
.shadow {
  background-color: black;
  opacity: 0;
  pointer-events: initial !important;
  cursor: default;

  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
`}
    </style>
  )
}

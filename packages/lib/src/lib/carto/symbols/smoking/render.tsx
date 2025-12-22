import { type ReactNode } from 'react'
import type { Kind } from '..'

export function Smoking(props: Readonly<{ id: Kind }>): ReactNode {
  return (
    <g id={`X${props.id}`} transform="translate(-36, -36)">
      <rect x="0.5" y="0.5" width="71" height="71" ry="6" stroke="white" />
      <rect x="8" y="46" height="8" width="48" fill="white" stroke="none" />
      <rect
        x="57.75"
        y="46"
        width="2.5"
        height="8"
        fill="white"
        stroke="none"
      />
      <rect
        x="61.75"
        y="46"
        width="2.5"
        height="8"
        fill="white"
        stroke="none"
      />
      <path
        d="m 59,44 0,-5 a 3.5,3.5 0 0 0 -3.5,-3.5 l -9,0 A 5,5 0 0 1 42,28 6.5,6.5 0 0 1 42,15"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
      <path
        d="m 63,44 0,-6 a 9,9 0 0 0 -9,-9 l -5,0 A 6.5,6.5 0 0 0 44,18"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
    </g>
  )
}

import { type ReactNode } from 'react'

import type { Kind } from '..'

export function StairsUp(props: Readonly<{ id: Kind }>): ReactNode {
  return (
    <g id={`X${props.id}`} transform="translate(-36, -36)">
      <rect x="0.5" y="0.5" width="71" height="71" ry="6" stroke="white" />
      <path
        d="m 9,56.5 12,0 0,-10 10,0 0,-10 10,0 0,-10 10,0 0,-10 12,0"
        fill="none"
        stroke="white"
        strokeWidth="5"
      />
      <path
        d="M 54,45 42,57 m 12,-3 0,-9 -9,0"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

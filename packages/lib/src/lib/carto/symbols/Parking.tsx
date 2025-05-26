import { type ReactNode } from 'react'

export function Parking(): ReactNode {
  return (
    <g id="XParking">
      <rect
        x="-35.5"
        y="-35.5"
        width="71"
        height="71"
        rx="6"
        ry="6"
        fill="black"
        stroke="white"
      />
      <path
        d="M -11,24 V -21 H 3 A 12.5,12.5 0 0 1 3,4 h -9"
        fill="none"
        stroke="white"
        strokeWidth={10}
      />
    </g>
  )
}

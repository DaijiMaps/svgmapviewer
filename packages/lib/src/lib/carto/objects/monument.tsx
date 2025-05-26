import { type ReactNode } from 'react'

export function Monument(): ReactNode {
  return (
    <path
      id="Xmonument"
      d={monumentPath}
      fill="none"
      stroke="black"
      strokeWidth="0.075"
    />
  )
}

export const monumentPath =
  'm -0.5 0 v -0.3 h 1 v 0.3 m -0.75 -0.3 v -1.2 h 0.5 v 1.2'

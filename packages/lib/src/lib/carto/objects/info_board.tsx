/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

export function InfoBoard(): ReactNode {
  return (
    <path
      id="Xinfo-board"
      d={infoBoardPath}
      fill="none"
      stroke="black"
      strokeWidth="0.05"
    />
  )
}

export const infoBoardPath =
  'm -0.4,0 v -0.7 m 0.8,0.7 v -0.7 m 0.1,0 h -1 v -0.7 h 1 z'

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { ReactNode } from 'react'
import { notifyActionFullscreen } from '../../event-action'

export function Fullscreen(): ReactNode {
  return (
    <div
      className={'button-item fullscreen'}
      onClick={() => notifyActionFullscreen()}
    >
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={d} />
      </svg>
    </div>
  )
}

const d = `
M0,0
m5,5
m-1,-1
h-8
v-8
h8
z
m1,-1
v-8
h-8
`

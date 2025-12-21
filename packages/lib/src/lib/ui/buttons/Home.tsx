/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { ReactNode } from 'react'
import { notifyActionReset } from '../../event-action'

export function Home(): ReactNode {
  return (
    <div className={'button-item home'} onClick={() => notifyActionReset()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={d} />
      </svg>
    </div>
  )
}

const d = `
m-5,1
l5,-5
l5,5
m-2,-2
l0,5
l-6,0
l0,-5
`

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { ReactNode } from 'react'
import { notifyActionZoomOut } from '../../event-action'

export function ZoomOut(): ReactNode {
  return (
    <div
      className={'button-item zoom-out'}
      onClick={() => notifyActionZoomOut()}
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
l-2,-2
a3,3 0,1,1 -6,-6
a3,3 0,1,1 6,6
m-3-3
m-2.5,0
h5
`

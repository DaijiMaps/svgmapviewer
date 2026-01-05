/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { ReactNode } from 'react'

import { notifyAction } from '../../event-action'

export function ZoomIn(): ReactNode {
  return (
    <div
      className={'button-item zoom-in'}
      onClick={() => notifyAction.zoomIn()}
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
m-2.5,-2.5
v5
`

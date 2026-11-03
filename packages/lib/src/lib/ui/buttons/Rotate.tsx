/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { ReactNode } from 'react'

import { useConfig } from '../../../config'
import type { SvgMapViewerConfig } from '../../../types'
import { notifyAction } from '../../event-action'

const shown = (cfg: Readonly<SvgMapViewerConfig>) =>
  cfg.uiConfig?.showRotate ?? true

export function Rotate(): ReactNode {
  const cfg = useConfig()
  return !shown(cfg) ? (
    <></>
  ) : (
    <div className={'button-item rotate'} onClick={() => notifyAction.rotate()}>
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={d} />
      </svg>
    </div>
  )
}

const d = `
M -4,-4
l 2,0
a 6,6 0,0,1 6,6
l 0,2
m -1,-2
l 1,2
l 1,-2
`

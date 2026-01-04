/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

import { svgMapViewerConfig } from '../../../config'
import { notifyActionPosition } from '../../event-action'

export function Position(): ReactNode {
  return svgMapViewerConfig.mapCoord.matrix.isIdentity ? (
    <></>
  ) : (
    <div
      className={'button-item position'}
      onClick={() => notifyActionPosition()}
    >
      <svg viewBox="-5.25 -5.25 10.5 10.5">
        <path d={d} />
      </svg>
    </div>
  )
}

// XXX
// XXX
// XXX
const h = 3
const r = h * Math.sqrt(2)
const H = r + h * 2
const y = H / 2

const d = `
M 0,0
m 0,${y}
l ${-h},${-h}
a ${r},${r} 0,1,1 ${2 * h},0
z
m 0,${-H + r + r / 2}
a ${r / 2},${r / 2} 0,1,0 0,${-r}
a ${r / 2},${r / 2} 0,1,0 0,${r}
`.replaceAll(/([.]\d\d)\d*/g, '$1')
// XXX
// XXX
// XXX

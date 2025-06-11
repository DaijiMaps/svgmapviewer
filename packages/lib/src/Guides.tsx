/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Measure, MeasureCoordinate, MeasureDistance } from './Measure'

export function Guides(): ReactNode {
  return (
    <div className="guides">
      <svg className="guides">
        <Measure />
      </svg>
      <MeasureDistance />
      <MeasureCoordinate />
    </div>
  )
}

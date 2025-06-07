/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

export function UiCss(): ReactNode {
  return (
    <style>
      {`
#ui > * {
  contain: content;
}
#ui > .detail-balloon {
  contain: initial;
}
.balloon,
.detail {
  contain: content;
}
`}
    </style>
  )
}

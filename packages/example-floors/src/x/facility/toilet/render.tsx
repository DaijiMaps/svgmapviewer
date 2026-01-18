import type { ReactNode } from 'react'

import type { Toilet } from './types'

export function RenderToilet(props: Readonly<Toilet>): ReactNode {
  return <p>{props.tag}</p>
}

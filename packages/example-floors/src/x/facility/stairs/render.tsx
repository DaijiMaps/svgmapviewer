import type { ReactNode } from 'react'
import type { Stairs } from './types'

export function RenderStairs(props: Readonly<Stairs>): ReactNode {
  return <p>{props.tag}</p>
}

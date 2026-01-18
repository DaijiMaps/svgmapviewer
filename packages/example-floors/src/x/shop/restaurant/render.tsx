import type { ReactNode } from 'react'

import type { Restaurant } from './types'

export function RenderRestaurant(props: Readonly<Restaurant>): ReactNode {
  return <p>{props.tag}</p>
}

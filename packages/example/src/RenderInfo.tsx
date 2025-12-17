import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  return <p>{props.info.title}</p>
}

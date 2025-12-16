import { ReactNode } from 'react'
import { Info } from 'svgmapviewer'

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  return <p>{props.info.title}</p>
}

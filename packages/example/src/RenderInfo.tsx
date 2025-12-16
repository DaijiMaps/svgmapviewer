import { ReactNode } from 'react'
import { Info } from 'svgmapviewer'

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  return <h1>{props.info.title}</h1>
}

import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import { RenderXInfo } from './x/render'

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  return RenderXInfo(props)
}

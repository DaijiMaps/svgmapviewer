import { type ReactNode } from 'react'
import { type Info } from './info'
import { RenderXInfo } from './x/render'

export interface Props {
  info: Info
}

export function RenderInfo(props: Readonly<Props>): ReactNode {
  return <RenderXInfo x={props.info.x} />
}

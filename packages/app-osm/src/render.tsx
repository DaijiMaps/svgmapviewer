import { type ReactNode } from 'react'
import { RenderXInfo } from './x/render'
import { type Info } from './x/types'

export interface Props {
  info: Info
}

export function RenderInfo(props: Readonly<Props>): ReactNode {
  return <RenderXInfo x={props.info.x} />
}

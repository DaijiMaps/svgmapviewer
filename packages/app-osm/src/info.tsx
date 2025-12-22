import { type ReactNode } from 'react'
import { RenderXInfo } from './x/render'
import { type Info } from './x/types'

export interface RenderInfoProps {
  info: Info
}

export function RenderInfo(props: Readonly<RenderInfoProps>): ReactNode {
  return <RenderXInfo x={props.info.x} />
}

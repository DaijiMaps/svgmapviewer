import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import { RenderFacility } from './x/facility/render'
import { RenderShop } from './x/shop/render'

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  return props.info.x.tag === 'shop' ? (
    <RenderShop info={props.info} shop={props.info.x} />
  ) : props.info.x.tag === 'facility' ? (
    <RenderFacility info={props.info} facility={props.info.x} />
  ) : (
    <></>
  )
}

import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

import { RenderFacility } from './facility/render'
import { RenderShop } from './shop/render'
import { RenderUnknown } from './unknown/render'

export function RenderXInfo(props: Readonly<{ info: Info }>): ReactNode {
  return props.info.x.tag === 'facility' ? (
    <RenderFacility info={props.info} kind={props.info.x.kind} />
  ) : props.info.x.tag === 'shop' ? (
    <RenderShop info={props.info} kind={props.info.x.kind} />
  ) : props.info.x.tag === 'unknown' ? (
    <RenderUnknown info={props.info} />
  ) : (
    <></>
  )
}

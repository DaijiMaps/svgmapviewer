import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import { type ShopKind } from './types'

export function RenderShop(
  props: Readonly<{ info: Info; kind: ShopKind }>
): ReactNode {
  return (
    <>
      <p>
        {props.info.x.tag}:{props.kind.tag}
      </p>
      <p>{props.info.title}</p>
    </>
  )
}

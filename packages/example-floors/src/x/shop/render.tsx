import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import { type ShopKind } from './types'
import { RenderBook } from './book/render'
import { RenderRestaurant } from './restaurant/render'

export function RenderShop(
  props: Readonly<{ info: Info; kind: ShopKind }>
): ReactNode {
  return (
    <>
      <p>
        {props.info.x.tag}:{props.kind.tag}
      </p>
      <p>{props.info.title}</p>
      {props.kind.tag === 'book' ? (
        <RenderBook {...props.kind} />
      ) : props.kind.tag === 'restaurant' ? (
        <RenderRestaurant {...props.kind} />
      ) : (
        <></>
      )}
    </>
  )
}

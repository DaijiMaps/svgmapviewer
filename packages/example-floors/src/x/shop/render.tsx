import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import { type ShopInfo } from './types'

export function RenderShop(
  props: Readonly<{ info: Info; shop: ShopInfo }>
): ReactNode {
  return (
    <>
      <p>{props.shop.tag}</p>
      <p>{props.info.title}</p>
    </>
  )
}

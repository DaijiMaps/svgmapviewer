import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

import type { Renderer, RendererMap, XTag } from './types'

function RenderInfoShopRestaurant(
  props: Parameters<RendererMap['shop.restaurant']>[0]
): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      <p>レストラン</p>
      <p>メニュー</p>
    </>
  )
}

function RenderInfoShopCafe(
  props: Parameters<RendererMap['shop.cafe']>[0]
): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      <p>カフェ</p>
      <p>メニュー</p>
    </>
  )
}

const renderers = {
  'shop.restaurant': RenderInfoShopRestaurant,
  'shop.cafe': RenderInfoShopCafe,
} satisfies RendererMap

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  const getRenderer = (tag: XTag) => renderers[tag] as Renderer
  const render = getRenderer(props.info.x.tag)
  return render({ title: props.info.title, x: props.info.x })
}

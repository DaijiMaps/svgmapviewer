import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

import type { Renderer, RendererMap, XTag } from './types'

function renderShopCafe(
  props: Parameters<RendererMap['shop.cafe']>[0]
): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      <p>カフェ</p>
      <p>メニュー</p>
      {props.x.nseats && <p>座席数: {props.x.nseats}</p>}
    </>
  )
}

function renderShopMisc(
  props: Parameters<RendererMap['shop.misc']>[0]
): ReactNode {
  return (
    <>
      <p>{props.title}</p>
    </>
  )
}

function renderShopRestaurant(
  props: Parameters<RendererMap['shop.restaurant']>[0]
): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      <p>レストラン</p>
      <p>メニュー</p>
      {props.x.nseats && <p>座席数: {props.x.nseats}</p>}
    </>
  )
}

const renderers = {
  'shop.cafe': renderShopCafe,
  'shop.misc': renderShopMisc,
  'shop.restaurant': renderShopRestaurant,
} satisfies RendererMap

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  const getRenderer = (tag: XTag) => renderers[tag] as Renderer
  const render = getRenderer(props.info.x.tag)
  return render({ title: props.info.title, x: props.info.x })
}

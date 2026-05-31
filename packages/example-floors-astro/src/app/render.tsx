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
      {props.x.nseats && <p>座席数: {props.x.nseats}</p>}
      <style>
        {`
.detail {
  color: white;
  background-color: #202020;
}
path.fg {
  fill: #202020;
  stroke: #202020;
}
`}
      </style>
    </>
  )
}

function renderShopMisc(
  props: Parameters<RendererMap['shop.misc']>[0]
): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      {props.x.message && <p>一言: {props.x.message}</p>}
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
  const getRenderer = <K extends XTag>(tag: XTag) =>
    renderers[tag] as Renderer<K>
  const render = getRenderer(props.info.x.tag)
  return render({ title: props.info.title, x: props.info.x })
}

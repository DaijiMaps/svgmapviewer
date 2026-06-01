import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

import type { XProps, XRenderer, XRendererMap, XTag } from './types'

function renderShopCafe(props: XProps<'shop.cafe'>): ReactNode {
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

function renderShopMisc(props: XProps<'shop.misc'>): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      {props.x.message && <p>一言: {props.x.message}</p>}
    </>
  )
}

function renderShopRestaurant(props: XProps<'shop.restaurant'>): ReactNode {
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
} satisfies XRendererMap

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  const getRenderer = <K extends XTag>(tag: K) => renderers[tag] as XRenderer<K>
  const render = getRenderer(props.info.x.tag)
  return render({ title: props.info.title, x: props.info.x })
}

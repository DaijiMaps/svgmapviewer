import { type ReactNode } from 'react'

import { makeRenderInfo } from './react'
import type { XProps, XRendererMap } from './types'

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

export const RenderInfo = makeRenderInfo(renderers)

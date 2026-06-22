import { type ReactNode } from 'react'

import type { XProps, XRendererMap } from '../../utils/types'

function RenderShopCafe(props: XProps<'shop.cafe'>): ReactNode {
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

function RenderShopMisc(props: XProps<'shop.misc'>): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      {props.x.message && <p>一言: {props.x.message}</p>}
    </>
  )
}

function RenderShopRestaurant(props: XProps<'shop.restaurant'>): ReactNode {
  return (
    <>
      <p>{props.title}</p>
      <p>レストラン</p>
      {props.x.nseats && <p>座席数: {props.x.nseats}</p>}
    </>
  )
}

export const infoRenderers = {
  'shop.cafe': RenderShopCafe,
  'shop.misc': RenderShopMisc,
  'shop.restaurant': RenderShopRestaurant,
} satisfies XRendererMap

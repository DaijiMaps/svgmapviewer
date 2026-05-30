import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

//import { RenderXInfo } from './x/render'

function RenderInfoShopRestaurant(props: Readonly<{ info: Info }>): ReactNode {
  return (
    <>
      <p>{props.info.title}</p>
      <p>レストラン</p>
      <p>メニュー</p>
    </>
  )
}

function RenderInfoShopCafe(props: Readonly<{ info: Info }>): ReactNode {
  return (
    <>
      <p>{props.info.title}</p>
      <p>カフェ</p>
      <p>メニュー</p>
    </>
  )
}

type Renderer = (props: Readonly<{ info: Info }>) => ReactNode

const renderers: Map<string, Renderer> = new Map([
  ['shop.restaurant', RenderInfoShopRestaurant],
  ['shop.cafe', RenderInfoShopCafe],
])

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  const r = renderers.get(props.info.x.tag)
  return r === undefined ? <></> : r(props)
}

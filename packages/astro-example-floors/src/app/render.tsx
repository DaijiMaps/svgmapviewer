import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

//import { RenderXInfo } from './x/render'

function RenderInfoShopRestaurant(props: Readonly<{ info: Info }>): ReactNode {
  return (
    <>
      <p>{props.info.title}</p>
    </>
  )
}

type Renderer = (props: Readonly<{ info: Info }>) => ReactNode

const renderers: Map<string, Renderer> = new Map([
  ['shop.restaurant', RenderInfoShopRestaurant],
  ['shop.cafe', RenderInfoShopRestaurant],
])

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  const r = renderers.get(props.info.tag)
  return r === undefined ? <></> : r(props)
}

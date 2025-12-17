import { type ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import { type FacilityInfo, type ShopInfo } from './types'

function RenderShop(
  props: Readonly<{ info: Info; shop: ShopInfo }>
): ReactNode {
  return (
    <>
      <p>{props.shop.tag}</p>
      <p>{props.info.title}</p>
    </>
  )
}

function RenderFacility(
  props: Readonly<{ info: Info; facility: FacilityInfo }>
): ReactNode {
  return (
    <>
      <p>
        {props.facility.tag}:{props.facility.kind.tag}
      </p>
      <p>{props.info.title}</p>
    </>
  )
}

export function RenderInfo(props: Readonly<{ info: Info }>): ReactNode {
  return props.info.x.tag === 'shop' ? (
    <RenderShop info={props.info} shop={props.info.x} />
  ) : props.info.x.tag === 'facility' ? (
    <RenderFacility info={props.info} facility={props.info.x} />
  ) : (
    <></>
  )
}

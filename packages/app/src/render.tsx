import { Like, svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { symbolNameMap } from '@daijimaps/svgmapviewer/carto-symbols'
import {
  findProperties,
  getPropertyValue,
  type OsmProperties,
} from '@daijimaps/svgmapviewer/geo'
import type { ReactNode } from 'react'
import { type FacilityInfo, type Info, type ShopInfo } from './info'

export interface Props {
  info: Info
}

export function RenderInfo(props: Readonly<Props>): ReactNode {
  const mapMap = svgMapViewerConfig.mapMap
  const id = Number(props.info.x.address)
  const properties =
    'address' in props.info.x ? findProperties(id, mapMap) : null
  if (properties === null) {
    return <p>XXX info not found (osm_id={props.info.x.address}) XXX</p>
  }
  return props.info.x.tag === 'shop'
    ? RenderShopInfo({ x: props.info.x, properties })
    : RenderFacilityInfo({ x: props.info.x, properties })
}

function RenderShopInfo(
  props: Readonly<{
    x: ShopInfo
    properties: OsmProperties
  }>
) {
  const website = getPropertyValue(props.properties, 'website')
  const osm_id = Number(props.properties.osm_id ?? '')
  const osm_way_id = Number(
    ('osm_way_id' in props.properties && props.properties.osm_way_id) ?? ''
  )
  const id = osm_id !== 0 ? osm_id : osm_way_id !== 0 ? osm_way_id : 0

  return (
    <>
      <p>
        {props.properties.name ?? props.x.name}
        {id !== 0 && <Like _id={id} />}
      </p>
      <p>
        {website !== null && (
          <a target="_blank" href={website}>
            🌐
          </a>
        )}
        {osm_id !== 0 && (
          <a target="_blank" href={`https://openstreetmap.org/node/${osm_id}`}>
            🗺️
          </a>
        )}
        {osm_way_id !== 0 && (
          <a
            target="_blank"
            href={`https://openstreetmap.org/way/${osm_way_id}`}
          >
            🗺️
          </a>
        )}
      </p>
    </>
  )
}

function RenderFacilityInfo(
  props: Readonly<{
    x: FacilityInfo
    properties: OsmProperties
  }>
) {
  const symbol = props.x.title !== undefined && symbolNameMap.get(props.x.title)

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '1em',
        }}
      >
        <svg
          style={{ display: 'block' }}
          viewBox="-36 -36 72 72"
          width="3em"
          height="3em"
        >
          {symbol && <use href={symbol} />}
        </svg>
      </div>
      <p>{props.x.properties.name}</p>
    </>
  )
}

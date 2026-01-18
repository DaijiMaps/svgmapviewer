import type { ReactNode } from 'react'

import { Like } from 'svgmapviewer'
import { getPropertyValue, type OsmProperties } from 'svgmapviewer/geo'

import type { ShopInfo } from './types'

import { RenderProperties } from '../render'

export function RenderShopInfo(
  props: Readonly<{
    x: ShopInfo
    properties: OsmProperties
  }>
): ReactNode {
  const website = getPropertyValue(props.properties, 'website')
  const osm_id = Number(props.properties.osm_id ?? '')
  const osm_way_id = Number(
    ('osm_way_id' in props.properties && props.properties.osm_way_id) ?? ''
  )
  const id = osm_id !== 0 ? osm_id : osm_way_id !== 0 ? osm_way_id : 0

  return (
    <>
      <p>
        {/* whitespace between name and star! */}
        {props.properties.name ?? props.x.name} {id !== 0 && <Like _id={id} />}
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
      <RenderProperties properties={props.properties} />
    </>
  )
}

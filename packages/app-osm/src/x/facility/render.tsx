import type { ReactNode } from 'react'
import { symbolNameMap } from 'svgmapviewer/carto-symbols'
import type { OsmProperties } from 'svgmapviewer/geo'
import { RenderProperties } from '../render'
import type { FacilityInfo } from './types'

export function RenderFacilityInfo(
  props: Readonly<{
    x: FacilityInfo
    properties: OsmProperties
  }>
): ReactNode {
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
      <RenderProperties properties={props.properties} />
    </>
  )
}

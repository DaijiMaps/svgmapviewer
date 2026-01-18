import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig } from 'svgmapviewer'
import { findProperties, type OsmProperties } from 'svgmapviewer/geo'

import type { XInfo } from './types'

import { RenderFacilityInfo } from './facility/render'
import { RenderShopInfo } from './shop/render'

export interface RenderXInfoProps {
  x: XInfo
}

export function RenderXInfo(props: Readonly<RenderXInfoProps>): ReactNode {
  const mapMap = svgMapViewerConfig.mapMap
  const id = Number(props.x.address)
  const properties = 'address' in props.x ? findProperties(id, mapMap) : null
  if (properties === null) {
    return <p>XXX info not found (osm_id={props.x.address}) XXX</p>
  }
  return props.x.tag === 'shop'
    ? RenderShopInfo({ x: props.x, properties })
    : RenderFacilityInfo({ x: props.x, properties })
}

export function RenderProperties(
  props: Readonly<{ properties: OsmProperties }>
): ReactNode {
  // XXX
  // XXX
  // XXX
  // XXX
  // XXX
  const tags_entries: [string, string][] = Object.keys(props.properties)
    .filter((s) => s !== 'other_tags' && !s.match(/^centroid|^area$/)) // XXX
    .filter(
      (s) =>
        s in props.properties &&
        props.properties instanceof Object &&
        props.properties[s as keyof OsmProperties] !== null
    )
    .map((x) => [x, String(props.properties[x as keyof OsmProperties])])
  const other_tags_entries =
    props.properties.other_tags
      ?.split(/","/g)
      .map((s) => s.split(/"=>"/).map((ss) => ss.replace(/"/, ''))) ?? []
  const tags_map = new Map([...tags_entries, ...other_tags_entries] as [
    string,
    string,
  ][])
  // XXX
  // XXX
  // XXX
  // XXX
  // XXX

  return (
    <table
      className="properties"
      style={{
        display: 'block',
        fontSize: 'x-small',
        borderSpacing: 0,
        margin: '1em 0.5em',
        maxWidth: 'calc(50vmin - 2em)',
        overflowX: 'scroll',
        overscrollBehaviorX: 'none',
        touchAction: 'pan-x pan-y',
      }}
    >
      <tbody style={{ border: 0 }}>
        <RenderTags tags={tags_map} />
      </tbody>
    </table>
  )
}

function RenderTags(props: Readonly<{ tags: Map<string, string> }>) {
  return (
    <>
      {Array.from(props.tags.entries()).map(([k, v], idx) => (
        <Fragment key={idx}>
          <tr
            style={{
              margin: 0,
              boxSizing: 'border-box',
            }}
          >
            <td
              style={{
                border: '0.5px darkgray solid',
                margin: 0,
                padding: '0.25em',
                boxSizing: 'border-box',
                //overflow: 'scroll',
                //overscrollBehavior: 'contain',
                scrollbarWidth: 'none',
                width: 'calc(50vmin - 2em)',
              }}
            >
              <span
                style={{
                  color: 'gray',
                }}
              >
                {k}
                {` `}
              </span>
              <span style={{}}>{v}</span>
            </td>
          </tr>
        </Fragment>
      ))}
    </>
  )
}

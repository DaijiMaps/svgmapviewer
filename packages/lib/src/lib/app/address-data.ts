/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { svgMapViewerConfig as cfg } from '@daijimaps/svgmapviewer'
import {
  findFeature,
  OsmPointLikeFeature,
  OsmPointLikeProperties,
} from '@daijimaps/svgmapviewer/geo'
import {
  AddressEntries,
  AddressEntry,
  SearchAddressRes,
} from '@daijimaps/svgmapviewer/search'
import { Info } from './info'

const pointAddresses = (): AddressEntries =>
  cfg.mapData.points.features.flatMap((f) => {
    const e = filterFeature(f)
    return e === null ? [] : [e]
  })

const centroidAddresses = (): AddressEntries =>
  cfg.mapData.centroids.features.flatMap((f) => {
    const e = filterFeature(f)
    return e === null ? [] : [e]
  })

export const addressEntries = (): AddressEntries => [
  ...pointAddresses(),
  ...centroidAddresses(),
]

function filterFeature(f: Readonly<OsmPointLikeFeature>): null | AddressEntry {
  const { properties, geometry } = f
  const id = getOsmId(properties)
  if (id === null) {
    return null
  }
  if (geometry.coordinates.length != 2) {
    return null
  }
  const [x, y] = geometry.coordinates
  if (properties.name?.match(/./)) {
    return { a: id, lonlat: { x, y } }
  } else if (properties.other_tags?.match(/("bus_stop"|"toilets")/)) {
    return { a: id, lonlat: { x, y } }
  }
  return null
}

export function getOsmId(
  properties: Readonly<OsmPointLikeProperties>
): null | string {
  if ('osm_id' in properties && typeof properties['osm_id'] === 'string') {
    return properties['osm_id']
  }
  if (
    'osm_way_id' in properties &&
    typeof properties['osm_way_id'] === 'string'
  ) {
    return properties['osm_way_id']
  }
  return null
}

export function getAddressInfo(res: Readonly<SearchAddressRes>): null | Info {
  const feature = findFeature(res?.address, cfg.mapData)
  if (feature === null) {
    return null
  }
  const properties = feature.properties
  // eslint-disable-next-line functional/no-let
  let info: null | Info = null
  if (properties?.other_tags?.match(/"toilets"/)) {
    info = {
      title: 'toilets',
      x: {
        tag: 'facility',
        title: 'toilets',
        address: res.address,
        properties,
      },
    }
  } else if (
    'highway' in properties &&
    properties?.highway?.match(/^bus_stop$/)
  ) {
    info = {
      title: 'bus_stop',
      x: {
        tag: 'facility',
        title: 'bus_stop',
        address: res.address,
        properties,
      },
    }
  } else {
    info = {
      title: 'shop',
      x: { tag: 'shop', address: res.address, properties },
    }
  }
  return info
}

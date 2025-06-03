import type { OsmPointLikeProperties } from './data-types'
import type { POIMatch } from './poi-types'

export function matchPOI(
  properties: Readonly<OsmPointLikeProperties>
): null | POIMatch {
  if ('highway' in properties && properties?.highway?.match(/^bus_stop$/)) {
    return {
      tag: 'facility',
      title: 'bus_stop',
    }
  }
  if ('highway' in properties && properties?.highway?.match(/^elevator$/)) {
    return {
      tag: 'facility',
      title: 'elevator',
    }
  }
  if ('highway' in properties && properties?.highway?.match(/^escalator$/)) {
    return {
      tag: 'facility',
      title: 'escalator',
    }
  }
  if (properties?.other_tags?.match(/"amenity"=>"toilets"/)) {
    return {
      tag: 'facility',
      title: 'toilets',
    }
  }
  return null
}

import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import { Info } from './info'

export function searchInfo(address: string, lonlat: Vec): null | Info {
  // XXX switch by address string
  const info: Info = {
    title: `Found: POI: (${lonlat.x},${lonlat.y})`,
    x: {
      tag: 'shop',
      name: `${address} @ ${lonlat.x}, ${lonlat.y}`,
      address: address,
    },
  }
  return info
}

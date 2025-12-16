import { SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'
import { RenderInfo as renderInfo } from './RenderInfo.tsx'
import { floorsConfig } from './floors.config.ts'
import { POI, SearchEntry } from 'svgmapviewer/geo'
import { AddressEntries } from 'svgmapviewer/search'

const searchEntries: SearchEntry[] = [
  {
    filter: () => true,
    getInfo: (_p, a) => ({
      title: a,
    }),
  },
]

const mapConfig: SvgMapViewerConfigUser = {
  backgroundColor: 'grey',
  getMapNames: () => pois,
  getAddressEntries: () => addresses,
  getAddressInfo: (_mapmap, _entries, res) => ({ title: res.address }),
  searchEntries,
  renderMap,
  renderInfo,
  isMapRendered,
  origViewBox: {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  floorsConfig,
}

const pois: POI[] = [
  {
    id: 0,
    name: ['a'],
    pos: { x: 0, y: 0 },
    size: 10,
  },
  {
    id: 1,
    name: ['b'],
    pos: { x: 100, y: 100 },
    size: 10,
  },
  {
    id: 2,
    name: ['c'],
    pos: { x: 200, y: 200 },
    size: 10,
  },
]

const addresses: AddressEntries = pois.map((poi) => ({
  a: poi.name.join(' '),
  coord: poi.pos,
}))

export default mapConfig

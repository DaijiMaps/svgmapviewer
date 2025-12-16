import { SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'
import { RenderInfo as renderInfo } from './RenderInfo.tsx'
import { floorsConfig } from './floors.config.ts'
import { POI } from 'svgmapviewer/geo'
import { AddressEntries } from 'svgmapviewer/search'

/*
const searchEntries: SearchEntry[] = [
  {
    filter: () => true,
    getInfo: (_p, a) => ({
      title: a,
      x: {
        tag: 'shop',
      },
    }),
  },
]
  */

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

const mapConfig: SvgMapViewerConfigUser = {
  origViewBox: {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  backgroundColor: 'grey',

  // OsmDataConfig

  // OsmRenderConfig
  renderMap,
  isMapRendered,
  getMapNames: () => pois,

  // OsmSearchConfig
  //searchEntries,
  getAddressEntries: () => addresses,
  getAddressInfo: (_mapmap, _entries, res) => ({
    title: res.address,
    x: { tag: 'shop' },
  }),
  renderInfo,

  // FloorsRenderConfig
  floorsConfig,
}

export default mapConfig

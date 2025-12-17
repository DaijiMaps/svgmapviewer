import { Info, SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'
import { SearchEntries, SearchPos } from 'svgmapviewer/search'
import { RenderInfo as renderInfo } from './RenderInfo.tsx'
import { floorsConfig } from './floors.config.ts'
import { pois } from './data.ts'

const addresses: SearchEntries = pois.map((poi) => ({
  address: poi.name.join(' '),
  coord: poi.pos,
  fidx: poi.fidx,
}))

function getAddressEntries() {
  return addresses
}

function getAddressInfo(pos: Readonly<SearchPos>): null | Info {
  return {
    title: pos.address,
    x: { tag: 'shop' },
  }
}

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
  //SearchEntries,
  getAddressEntries,
  getAddressInfo,
  renderInfo,

  // FloorsRenderConfig
  floorsConfig,
}

export default mapConfig

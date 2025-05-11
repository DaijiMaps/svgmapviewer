/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement } from 'react'
import { RenderMapCommon } from './carto'
import { RenderMapAssetsDefault } from './carto/assets'
import { emptyMapData } from './geo/data'
import type {
  Info,
  RenderInfo,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './types'
import { VecVec } from './vec/prefixed'

const renderInfoDefault: RenderInfo = (props: Readonly<{ info: Info }>) =>
  createElement('p', {}, props.info.title)

function mapCoordDefault(p: VecVec): VecVec {
  return p
}

export let svgMapViewerConfig: SvgMapViewerConfig = {
  root: 'root',
  map: 'map',
  href: 'map.svg',
  width: 0,
  height: 0,
  fontSize: 16,
  origViewBox: { x: 0, y: 0, width: 0, height: 0 },
  title: 'svgmapviewer',
  subtitle:
    'svgmapviewer - An (opinionated) interactive offline SVG map viewer',
  copyright: '@ Daiji Maps',
  zoomFactor: 2,
  animationDuration: 625,
  dragStepAlpha: 0.375,
  dragStepStepLimit: 10,
  dragStepMaxCount: 100,
  scrollIdleTimeout: 200,
  zoomStartCbs: new Set(),
  zoomEndCbs: new Set(),
  searchStartCbs: new Set(),
  searchCbs: new Set(),
  searchDoneCbs: new Set(),
  searchEndCbs: new Set(),
  uiOpenCbs: new Set(),
  uiOpenDoneCbs: new Set(),
  uiCloseCbs: new Set(),
  uiCloseDoneCbs: new Set(),
  renderAssets: RenderMapAssetsDefault,
  getMapLayers: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
  renderMap: RenderMapCommon,
  renderInfo: renderInfoDefault,
  mapData: emptyMapData,
  mapCoord: {
    fromGeo: mapCoordDefault,
    toGeo: mapCoordDefault,
  },
  mapHtmlStyle: '',
  mapSymbols: [],
  mapNames: [],
}

export function updateSvgMapViewerConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  svgMapViewerConfig = {
    ...svgMapViewerConfig,
    ...(configUser as SvgMapViewerConfig),
  }
}

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement } from 'react'
import { RenderMapDefault } from '../Map'
import { emptyMapData } from './geo/data-types'
import {
  type Info,
  type RenderInfo,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
} from './types'

const renderInfoDefault: RenderInfo = (
  props: Readonly<{ info: Readonly<Info> }>
) => createElement('p', {}, props.info.title)

// XXX
// XXX migrate to configActor
// XXX
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
  zoomFactor: 3,
  animationDuration: 625,
  dragStepAlpha: 0.375,
  dragStepStepLimit: 10,
  dragStepMaxCount: 100,
  scrollIdleTimeout: 1000,

  // RenderConfig
  getMapLayers: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
  getMapNames: () => [],
  searchEntries: [],
  renderInfo: renderInfoDefault,
  mapSvgStyle: '',
  renderMap: RenderMapDefault,
  isMapRendered: () => true,

  // DataConfig
  mapData: emptyMapData,
  mapMap: {
    pointMap: new Map(),
    lineMap: new Map(),
    multilinestringMap: new Map(),
    multipolygonMap: new Map(),
  },
  mapCoord: {
    matrix: new DOMMatrixReadOnly(),
  },
}

export function updateSvgMapViewerConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  svgMapViewerConfig = {
    ...svgMapViewerConfig,
    ...(configUser as SvgMapViewerConfig),
  }
}

////

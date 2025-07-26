/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement, type ReactNode } from 'react'
import { emptyMapData } from './lib/geo/data-types'
import {
  type Info,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
} from './types'

function renderInfoDefault(
  props: Readonly<{ info: Readonly<Info> }>
): ReactNode {
  return createElement('p', {}, props.info.title)
}

function renderMapDefault(): ReactNode {
  return createElement('div')
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
  zoomFactor: 3,
  isContainerRendered: () => true,
  isUiRendered: () => true,

  // RenderConfig
  getMapLayers: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
  getMapNames: () => [],
  searchEntries: [],
  renderInfo: renderInfoDefault,
  mapSvgStyle: '',
  renderMap: renderMapDefault,
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

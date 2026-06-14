import { createAtom, type Atom } from '@xstate/store'
//import { useAtom } from '@xstate/store/react'
import { useAtom } from '@xstate/store-react'
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import { createElement, type ReactNode } from 'react'

import { emptyMapData } from './lib/geo/data-types'
import {
  type Info,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
} from './types'

function RenderInfoDefault(
  props: Readonly<{ info: Readonly<Info> }>
): ReactNode {
  return createElement('p', {}, props.info.title)
}

function renderMapDefault(): ReactNode {
  return createElement('div')
}

const configDefault: SvgMapViewerConfig = {
  root: 'root',
  href: 'map.svg',
  width: 0,
  height: 0,
  fontSize: 16,
  title: 'svgmapviewer',
  subtitle:
    'svgmapviewer - An (opinionated) interactive offline SVG map viewer',
  copyright: '@ Daiji Maps',
  zoomFactor: 3,
  isContainerRendered: () => true,
  isUiRendered: () => true,

  // OsmDataConfig
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
  origViewBox: { x: 0, y: 0, width: 0, height: 0 },

  // OsmRenderConfig
  renderMap: renderMapDefault,
  isMapRendered: () => true,
  getMapNames: () => [],
  getMapPaths: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
  mapSvgStyle: '',

  // OsmSearchConfig
  osmSearchEntries: [],
  getSearchEntries: () => [],
  getSearchInfo: () => null,
  RenderInfo: RenderInfoDefault,
}

export const configAtom: Atom<SvgMapViewerConfig> =
  createAtom<SvgMapViewerConfig>(configDefault)

export const getConfig = (): SvgMapViewerConfig => configAtom.get()

export const useConfig = (): SvgMapViewerConfig => useAtom(configAtom)

export const setConfig = (user: Readonly<SvgMapViewerConfigUser>): void =>
  configAtom.set((config) => ({ ...config, ...user }))

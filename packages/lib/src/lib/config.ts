/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createContext, createElement } from 'react'
import { assign, createActor, setup, StateFrom } from 'xstate'
import { RenderMapCommon } from './carto'
import { RenderMapAssetsDefault } from './carto/assets'
import { POI } from './geo'
import { emptyMapData } from './geo/data'
import type {
  Info,
  RenderInfo,
  SearchCb,
  SearchDoneCb,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
  UiCloseCb,
  UiOpenCb,
  UiOpenDoneCb,
  ZoomEndCb,
  ZoomStartCb,
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
  scrollIdleTimeout: 1000,
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

//// XXX xstate

interface ConfigContext {
  zoomStartCbs: Set<ZoomStartCb>
  zoomEndCbs: Set<ZoomEndCb>
  searchStartCbs: Set<SearchCb>
  searchCbs: Set<SearchCb>
  searchDoneCbs: Set<SearchDoneCb>
  searchEndCbs: Set<SearchDoneCb>
  uiOpenCbs: Set<UiOpenCb>
  uiOpenDoneCbs: Set<UiOpenDoneCb>
  uiCloseCbs: Set<UiCloseCb>
  uiCloseDoneCbs: Set<UiCloseCb>
  mapNames: POI[]
}
type ConfigEvent =
  | { type: 'SET.MAPNAMES'; mapNames: POI[] }
  | {
      type: 'ADD.CB'
      zoomStartCb?: ZoomStartCb
      zoomEndCb?: ZoomEndCb
      searchStartCb?: SearchCb
      searchCb?: SearchCb
      searchDoneCb?: SearchDoneCb
      searchEndCb?: SearchDoneCb
      uiOpenCb?: UiOpenCb
      uiOpenDoneCb?: UiOpenDoneCb
      uiCloseCb?: UiCloseCb
      uiCloseDoneCb?: UiCloseCb
    }
  | {
      type: 'DELETE.CB'
      zoomStartCb?: ZoomStartCb
      zoomEndCb?: ZoomEndCb
      searchStartCb?: SearchCb
      searchCb?: SearchCb
      searchDoneCb?: SearchDoneCb
      searchEndCb?: SearchDoneCb
      uiOpenCb?: UiOpenCb
      uiOpenDoneCb?: UiOpenDoneCb
      uiCloseCb?: UiCloseCb
      uiCloseDoneCb?: UiCloseCb
    }

const configMachine = setup({
  types: {
    context: {} as ConfigContext,
    events: {} as ConfigEvent,
  },
}).createMachine({
  id: 'config1',
  initial: 'Idle',
  context: {
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
    mapNames: [],
  },
  states: {
    Idle: {
      on: {
        'ADD.CB': {
          actions: assign({
            zoomStartCbs: ({ context, event }) =>
              event.zoomStartCb === undefined
                ? context.zoomStartCbs
                : context.zoomStartCbs.add(event.zoomStartCb),
            zoomEndCbs: ({ context, event }) =>
              event.zoomEndCb === undefined
                ? context.zoomEndCbs
                : context.zoomEndCbs.add(event.zoomEndCb),
            searchStartCbs: ({ context, event }) =>
              event.searchStartCb === undefined
                ? context.searchStartCbs
                : context.searchStartCbs.add(event.searchStartCb),
            searchCbs: ({ context, event }) =>
              event.searchCb === undefined
                ? context.searchCbs
                : context.searchCbs.add(event.searchCb),
            searchDoneCbs: ({ context, event }) =>
              event.searchDoneCb === undefined
                ? context.searchDoneCbs
                : context.searchDoneCbs.add(event.searchDoneCb),
            searchEndCbs: ({ context, event }) =>
              event.searchEndCb === undefined
                ? context.searchEndCbs
                : context.searchEndCbs.add(event.searchEndCb),
            uiOpenCbs: ({ context, event }) =>
              event.uiOpenCb === undefined
                ? context.uiOpenCbs
                : context.uiOpenCbs.add(event.uiOpenCb),
            uiOpenDoneCbs: ({ context, event }) =>
              event.uiOpenDoneCb === undefined
                ? context.uiOpenDoneCbs
                : context.uiOpenDoneCbs.add(event.uiOpenDoneCb),
            uiCloseCbs: ({ context, event }) =>
              event.uiCloseCb === undefined
                ? context.uiCloseCbs
                : context.uiCloseCbs.add(event.uiCloseCb),
            uiCloseDoneCbs: ({ context, event }) =>
              event.uiCloseDoneCb === undefined
                ? context.uiCloseDoneCbs
                : context.uiCloseDoneCbs.add(event.uiCloseDoneCb),
          }),
        },
        'DELETE.CB': {
          actions: assign({
            zoomStartCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.zoomStartCb !== undefined) {
                context.zoomStartCbs.delete(event.zoomStartCb)
              }
              return context.zoomStartCbs
            },
            zoomEndCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.zoomEndCb !== undefined) {
                context.zoomEndCbs.delete(event.zoomEndCb)
              }
              return context.zoomEndCbs
            },
            searchStartCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.searchStartCb !== undefined) {
                context.searchStartCbs.delete(event.searchStartCb)
              }
              return context.searchStartCbs
            },
            searchCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.searchCb !== undefined) {
                context.searchCbs.delete(event.searchCb)
              }
              return context.searchCbs
            },
            searchDoneCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.searchDoneCb !== undefined) {
                context.searchDoneCbs.delete(event.searchDoneCb)
              }
              return context.searchDoneCbs
            },
            searchEndCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.searchEndCb !== undefined) {
                context.searchEndCbs.delete(event.searchEndCb)
              }
              return context.searchEndCbs
            },
            uiOpenCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.uiOpenCb !== undefined) {
                context.uiOpenCbs.delete(event.uiOpenCb)
              }
              return context.uiOpenCbs
            },
            uiOpenDoneCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.uiOpenDoneCb !== undefined) {
                context.uiOpenDoneCbs.delete(event.uiOpenDoneCb)
              }
              return context.uiOpenDoneCbs
            },
            uiCloseCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.uiCloseCb !== undefined) {
                context.uiCloseCbs.delete(event.uiCloseCb)
              }
              return context.uiCloseCbs
            },
            uiCloseDoneCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.uiCloseDoneCb !== undefined) {
                context.uiCloseDoneCbs.delete(event.uiCloseDoneCb)
              }
              return context.uiCloseDoneCbs
            },
          }),
        },
        'SET.MAPNAMES': {
          actions: assign({
            mapNames: ({ event }) => event.mapNames,
          }),
        },
      },
    },
  },
})

export const configActor = createActor(configMachine, {
  inspect: (iev) => console.log(iev),
})
configActor.start()

export const configContext = createContext(configActor.ref)

export type ConfigMachine = typeof configMachine
export type ConfigState = StateFrom<ConfigMachine>

export const selectMapNames = (state: Readonly<ConfigState>) =>
  state.context.mapNames

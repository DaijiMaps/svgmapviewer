/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createContext, createElement } from 'react'
import { assign, createActor, setup, StateFrom } from 'xstate'
import { POI } from './geo'
import { emptyMapData } from './geo/data'
import type {
  ConfigCbs,
  Info,
  LayoutCb,
  RenderInfo,
  SearchCb,
  SearchDoneCb,
  SearchEndCb,
  SearchEndDoneCb,
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
  getMapLayers: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
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

interface ConfigContext extends ConfigCbs {
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
      searchEndCb?: SearchEndCb
      searchEndDoneCb?: SearchEndDoneCb
      uiOpenCb?: UiOpenCb
      uiOpenDoneCb?: UiOpenDoneCb
      uiCloseCb?: UiCloseCb
      uiCloseDoneCb?: UiCloseCb
      layoutCb?: LayoutCb
    }
  | {
      type: 'DELETE.CB'
      zoomStartCb?: ZoomStartCb
      zoomEndCb?: ZoomEndCb
      searchStartCb?: SearchCb
      searchCb?: SearchCb
      searchDoneCb?: SearchDoneCb
      searchEndCb?: SearchEndCb
      searchEndDoneCb?: SearchEndDoneCb
      uiOpenCb?: UiOpenCb
      uiOpenDoneCb?: UiOpenDoneCb
      uiCloseCb?: UiCloseCb
      uiCloseDoneCb?: UiCloseCb
      layoutCb?: LayoutCb
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
    searchEndDoneCbs: new Set(),
    uiOpenCbs: new Set(),
    uiOpenDoneCbs: new Set(),
    uiCloseCbs: new Set(),
    uiCloseDoneCbs: new Set(),
    layoutCbs: new Set(),
    mapNames: [],
  },
  states: {
    Idle: {
      on: {
        // XXX refactor
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
            searchEndDoneCbs: ({ context, event }) =>
              event.searchEndDoneCb === undefined
                ? context.searchEndDoneCbs
                : context.searchEndDoneCbs.add(event.searchEndDoneCb),
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
            layoutCbs: ({ context, event }) =>
              event.layoutCb === undefined
                ? context.layoutCbs
                : context.layoutCbs.add(event.layoutCb),
          }),
        },
        // XXX refactor
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
            searchEndDoneCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.searchEndDoneCb !== undefined) {
                context.searchEndDoneCbs.delete(event.searchEndDoneCb)
              }
              return context.searchEndDoneCbs
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
            layoutCbs: ({ context, event }) => {
              // eslint-disable-next-line functional/no-conditional-statements
              if (event.layoutCb !== undefined) {
                context.layoutCbs.delete(event.layoutCb)
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

export const configActor = createActor(configMachine)
configActor.start()

export const configContext = createContext(configActor.ref)

export type ConfigMachine = typeof configMachine
export type ConfigState = StateFrom<ConfigMachine>

export const selectMapNames = (state: Readonly<ConfigState>) =>
  state.context.mapNames

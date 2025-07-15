import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import {
  animationCbs,
  layoutCbs,
  resizeCbs,
  searchCbs,
  searchDoneCbs,
  searchEndCbs,
  searchEndDoneCbs,
  searchStartCbs,
  uiCloseCbs,
  uiCloseDoneCbs,
  uiOpenCbs,
  uiOpenDoneCbs,
  zoomEndCbs,
  zoomStartCbs,
} from './config'
import { type POI } from './geo'
import {
  type Info,
  type SearchCb,
  type SearchDoneCb,
  type SearchEndCb,
  type SearchEndDoneCb,
  type SearchStartCb,
  type SvgMapViewerConfig,
  type UiCloseCb,
  type UiCloseDoneCb,
  type UiOpenCb,
  type UiOpenDoneCb,
  type ZoomEndCb,
  type ZoomStartCb,
} from './types'
import { type VecVec } from './vec/prefixed'
import type { Animation } from './viewer/animation-types'
import { type Layout } from './viewer/layout'

interface ConfigContext {
  // XXX SvgMapViewerConfig
  mapNames: POI[]
}

type ConfigEvent =
  | ({ type: 'SET' } & Partial<SvgMapViewerConfig>)
  | { type: 'SET.MAPNAMES'; mapNames: POI[] }
  | { type: 'ADD.CB' }
  | { type: 'DELETE.CB' }

const configMachine = setup({
  types: {
    context: {} as ConfigContext,
    events: {} as ConfigEvent,
  },
  actions: {
    addCallbacks: () => {},
    deleteCallbacks: () => {},
  },
}).createMachine({
  id: 'config1',
  initial: 'Idle',
  context: {
    mapNames: [],
  },
  states: {
    Idle: {
      on: {
        // XXX refactor
        'ADD.CB': {},
        // XXX refactor
        'DELETE.CB': {
          actions: assign({}),
        },
        SET: {
          // XXX
          // XXX
          // XXX
          // XXX not yet
          // XXX
          // XXX
          // XXX
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

////

const configActor = createActor(configMachine)
configActor.start()

export function configActorStart(): void {
  configActor.start()
}

export function configSend(ev: ConfigEvent): void {
  configActor.send(ev)
}

////

export function useConfigMapNames(): POI[] {
  return useSelector(configActor, (state) => state.context.mapNames)
}

////

export function notifySearchStart(psvg: VecVec): void {
  searchStartCbs.forEach((cb: SearchStartCb) => cb(psvg))
}
export function notifySearch(psvg: VecVec): void {
  searchCbs.forEach((cb: SearchCb) => cb(psvg))
}
export function notifySearchDone(psvg: VecVec, info: Readonly<Info>): void {
  searchDoneCbs.forEach((cb: SearchDoneCb) => cb({ psvg, info }))
}
export function notifySearchEnd(psvg: VecVec, info: Readonly<Info>): void {
  searchEndCbs.forEach((cb: SearchEndCb) => cb({ psvg, info }))
}
export function notifySearchEndDone(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
): void {
  searchEndDoneCbs.forEach((cb: SearchEndDoneCb) => cb(psvg, info, layout))
}
export function notifyUiOpen(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
): void {
  uiOpenCbs.forEach((cb: UiOpenCb) => cb(psvg, info, layout))
}
export function notifyUiOpenDone(ok: boolean): void {
  uiOpenDoneCbs.forEach((cb: UiOpenDoneCb) => cb(ok))
}
export function notifyUiClose(): void {
  uiCloseCbs.forEach((cb: UiCloseCb) => cb())
}
export function notifyUiCloseDone(): void {
  uiCloseDoneCbs.forEach((cb: UiCloseDoneCb) => cb())
}

export function notifyZoomStart(
  layout: Readonly<Layout>,
  zoom: number,
  z: number
): void {
  zoomStartCbs.forEach((cb: ZoomStartCb) => cb(layout, zoom, z))
}
export function notifyZoomEnd(layout: Readonly<Layout>, zoom: number): void {
  zoomEndCbs.forEach((cb: ZoomEndCb) => cb(layout, zoom))
}

export function notifyResize(layout: Readonly<Layout>, force: boolean): void {
  resizeCbs.forEach((cb) => cb(layout, force))
}
export function notifyLayout(layout: Readonly<Layout>, force: boolean): void {
  layoutCbs.forEach((cb) => cb(layout, force))
}
export function notifyAnimation(animation: null | Readonly<Animation>): void {
  animationCbs.forEach((cb) => cb(animation))
}

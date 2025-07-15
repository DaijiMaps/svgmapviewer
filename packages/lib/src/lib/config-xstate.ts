import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import {
  animationCbs,
  layoutCbs,
  resizeCbs,
  uiCloseCbs,
  uiCloseDoneCbs,
  uiOpenCbs,
  uiOpenDoneCbs,
  zoomEndCbs,
  zoomStartCbs,
} from './config'
import { type POI } from './geo'
import {
  type ConfigCb,
  type ConfigCbs,
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

interface ConfigContext extends ConfigCbs {
  // XXX SvgMapViewerConfig
  mapNames: POI[]
}

type ConfigEvent =
  | ({ type: 'SET' } & Partial<SvgMapViewerConfig>)
  | { type: 'SET.MAPNAMES'; mapNames: POI[] }
  | ({ type: 'ADD.CB' } & Partial<ConfigCb>)
  | ({ type: 'DELETE.CB' } & Partial<ConfigCb>)

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
    searchStartCbs: new Set(),
    searchCbs: new Set(),
    searchDoneCbs: new Set(),
    searchEndCbs: new Set(),
    searchEndDoneCbs: new Set(),
    mapNames: [],
  },
  states: {
    Idle: {
      on: {
        // XXX refactor
        'ADD.CB': {
          actions: assign({
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
          }),
        },
        // XXX refactor
        'DELETE.CB': {
          actions: assign({
            searchStartCbs: ({ context, event }) => {
              if (event.searchStartCb !== undefined) {
                context.searchStartCbs.delete(event.searchStartCb)
              }
              return context.searchStartCbs
            },
            searchCbs: ({ context, event }) => {
              if (event.searchCb !== undefined) {
                context.searchCbs.delete(event.searchCb)
              }
              return context.searchCbs
            },
            searchDoneCbs: ({ context, event }) => {
              if (event.searchDoneCb !== undefined) {
                context.searchDoneCbs.delete(event.searchDoneCb)
              }
              return context.searchDoneCbs
            },
            searchEndCbs: ({ context, event }) => {
              if (event.searchEndCb !== undefined) {
                context.searchEndCbs.delete(event.searchEndCb)
              }
              return context.searchEndCbs
            },
            searchEndDoneCbs: ({ context, event }) => {
              if (event.searchEndDoneCb !== undefined) {
                context.searchEndDoneCbs.delete(event.searchEndDoneCb)
              }
              return context.searchEndDoneCbs
            },
          }),
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
  configActor
    .getSnapshot()
    .context.searchStartCbs.forEach((cb: SearchStartCb) => cb(psvg))
}
export function notifySearch(psvg: VecVec): void {
  configActor
    .getSnapshot()
    .context.searchCbs.forEach((cb: SearchCb) => cb(psvg))
}
export function notifySearchDone(psvg: VecVec, info: Readonly<Info>): void {
  configActor
    .getSnapshot()
    .context.searchDoneCbs.forEach((cb: SearchDoneCb) => cb({ psvg, info }))
}
export function notifySearchEnd(psvg: VecVec, info: Readonly<Info>): void {
  configActor
    .getSnapshot()
    .context.searchEndCbs.forEach((cb: SearchEndCb) => cb({ psvg, info }))
}
export function notifySearchEndDone(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
): void {
  configActor
    .getSnapshot()
    .context.searchEndDoneCbs.forEach((cb: SearchEndDoneCb) =>
      cb(psvg, info, layout)
    )
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

////

export function registerCbs(cbs: Readonly<Partial<ConfigCb>>): void {
  configActorStart()
  configSend({ type: 'ADD.CB', ...cbs })
}

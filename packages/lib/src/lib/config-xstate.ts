import { useSelector } from '@xstate/react'
import { assign, createActor, setup, type StateFrom } from 'xstate'
import { type POI } from './geo'
import type { Layout } from './layout'
import type {
  ConfigCb,
  ConfigCbs,
  ConfigLayout,
  ConfigResize,
  ConfigZoomStart,
  Info,
  LayoutCb,
  ResizeCb,
  SearchCb,
  SearchDoneCb,
  SearchEndCb,
  SearchEndDoneCb,
  SearchStartCb,
  SvgMapViewerConfig,
  UiCloseCb,
  UiCloseDoneCb,
  UiOpenCb,
  UiOpenDoneCb,
  ZoomEndCb,
  ZoomStartCb,
} from './types'
import type { VecVec } from './vec/prefixed'

interface ConfigContext extends ConfigCbs {
  // XXX SvgMapViewerConfig
  mapNames: POI[]
}

type ConfigEvent =
  | ({ type: 'SET' } & Partial<SvgMapViewerConfig>)
  | { type: 'SET.MAPNAMES'; mapNames: POI[] }
  | ({ type: 'ADD.CB' } & Partial<ConfigCb>)
  | ({ type: 'DELETE.CB' } & Partial<ConfigCb>)
  | ConfigZoomStart
  | ConfigResize
  | ConfigLayout

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
    resizeCbs: new Set(),
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
            resizeCbs: ({ context, event }) =>
              event.resizeCb === undefined
                ? context.resizeCbs
                : context.resizeCbs.add(event.resizeCb),
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
              if (event.zoomStartCb !== undefined) {
                context.zoomStartCbs.delete(event.zoomStartCb)
              }
              return context.zoomStartCbs
            },
            zoomEndCbs: ({ context, event }) => {
              if (event.zoomEndCb !== undefined) {
                context.zoomEndCbs.delete(event.zoomEndCb)
              }
              return context.zoomEndCbs
            },
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
            uiOpenCbs: ({ context, event }) => {
              if (event.uiOpenCb !== undefined) {
                context.uiOpenCbs.delete(event.uiOpenCb)
              }
              return context.uiOpenCbs
            },
            uiOpenDoneCbs: ({ context, event }) => {
              if (event.uiOpenDoneCb !== undefined) {
                context.uiOpenDoneCbs.delete(event.uiOpenDoneCb)
              }
              return context.uiOpenDoneCbs
            },
            uiCloseCbs: ({ context, event }) => {
              if (event.uiCloseCb !== undefined) {
                context.uiCloseCbs.delete(event.uiCloseCb)
              }
              return context.uiCloseCbs
            },
            uiCloseDoneCbs: ({ context, event }) => {
              if (event.uiCloseDoneCb !== undefined) {
                context.uiCloseDoneCbs.delete(event.uiCloseDoneCb)
              }
              return context.uiCloseDoneCbs
            },
            resizeCbs: ({ context, event }) => {
              if (event.resizeCb !== undefined) {
                context.resizeCbs.delete(event.resizeCb)
              }
              return context.resizeCbs
            },
            layoutCbs: ({ context, event }) => {
              if (event.layoutCb !== undefined) {
                context.layoutCbs.delete(event.layoutCb)
              }
              return context.layoutCbs
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
        'CONFIG.ZOOM.START': {
          actions: ({
            context,
            event: { layout, zoom, z },
          }: {
            context: ConfigContext
            event: ConfigZoomStart
          }): void =>
            context.zoomStartCbs.forEach((cb: ZoomStartCb): void =>
              cb(layout, zoom, z)
            ),
        },
        'CONFIG.RESIZE': {
          actions: ({
            context,
            event: { layout, force },
          }: {
            context: ConfigContext
            event: ConfigResize
          }): void =>
            context.resizeCbs.forEach((cb: ResizeCb): void =>
              cb(layout, force)
            ),
        },
        'CONFIG.LAYOUT': {
          actions: ({
            context,
            event: { layout, force },
          }: {
            context: ConfigContext
            event: ConfigLayout
          }): void =>
            context.layoutCbs.forEach((cb: LayoutCb): void =>
              cb(layout, force)
            ),
        },
      },
    },
  },
})

const configActor = createActor(configMachine)
configActor.start()

type ConfigMachine = typeof configMachine
type ConfigState = StateFrom<ConfigMachine>

const selectMapNames = (state: Readonly<ConfigState>): POI[] =>
  state.context.mapNames

////

export function useConfigMapNames(): POI[] {
  return useSelector(configActor, selectMapNames)
}

export function configStart(): void {
  configActor.start()
}

export function configSend(ev: ConfigEvent): void {
  configActor.send(ev)
}

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
  configActor
    .getSnapshot()
    .context.uiOpenCbs.forEach((cb: UiOpenCb) => cb(psvg, info, layout))
}
export function notifyUiOpenDone(ok: boolean): void {
  configActor
    .getSnapshot()
    .context.uiOpenDoneCbs.forEach((cb: UiOpenDoneCb) => cb(ok))
}
export function notifyUiClose(): void {
  configActor.getSnapshot().context.uiCloseCbs.forEach((cb: UiCloseCb) => cb())
}
export function notifyUiCloseDone(): void {
  configActor
    .getSnapshot()
    .context.uiCloseDoneCbs.forEach((cb: UiCloseDoneCb) => cb())
}
export function notifyZoomStart(
  layout: Readonly<Layout>,
  zoom: number,
  z: number
): void {
  configActor
    .getSnapshot()
    .context.zoomStartCbs.forEach((cb: ZoomStartCb) => cb(layout, zoom, z))
}
export function notifyZoomEnd(layout: Readonly<Layout>, zoom: number): void {
  configActor
    .getSnapshot()
    .context.zoomEndCbs.forEach((cb: ZoomEndCb) => cb(layout, zoom))
}
export function notifyResize(layout: Readonly<Layout>, force: boolean): void {
  configActor.send({ type: 'CONFIG.RESIZE', layout, force })
}
export function notifyLayout(layout: Readonly<Layout>, force: boolean): void {
  configActor.send({ type: 'CONFIG.LAYOUT', layout, force })
}

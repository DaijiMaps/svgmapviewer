import { Actor, assign, createActor, setup, type StateFrom } from 'xstate'
import { type POI } from './geo'
import type {
  ConfigCb,
  ConfigCbs,
  ConfigLayout,
  ConfigResize,
  ConfigZoomStart,
  SvgMapViewerConfig,
} from './types'

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
          actions: ({ context, event: { layout, zoom, z } }) =>
            context.zoomStartCbs.forEach((cb) => cb(layout, zoom, z)),
        },
        'CONFIG.RESIZE': {
          actions: ({ context, event: { layout, force } }) =>
            context.resizeCbs.forEach((cb) => cb(layout, force)),
        },
        'CONFIG.LAYOUT': {
          actions: ({ context, event: { layout, force } }) =>
            context.layoutCbs.forEach((cb) => cb(layout, force)),
        },
      },
    },
  },
})

export const configActor: Actor<typeof configMachine> =
  createActor(configMachine)
configActor.start()

export type ConfigMachine = typeof configMachine
export type ConfigState = StateFrom<ConfigMachine>
export type ConfigActor = typeof configActor

export const selectMapNames = (state: Readonly<ConfigState>): POI[] =>
  state.context.mapNames

export function configSend(ev: ConfigEvent): void {
  configActor.send(ev)
}

import { ActorRefFrom, setup, StateFrom } from 'xstate'
import { Info, SearchCb, SearchReq, SearchRes, UiOpenCb } from './types'
import { Vec } from './vec'

export interface SearchInput {
  startCb: SearchCb
  endCb: UiOpenCb
}

export interface SearchContext {
  startCb: SearchCb
  endCb: UiOpenCb
}

export type SearchEvent =
  | { type: 'SEARCH'; p: Vec; psvg: Vec }
  | { type: 'SEARCH.DONE'; p: Vec; psvg: Vec; info: Info }
  | { type: 'SEARCH.CANCEL' }

export const searchMachine = setup({
  types: {} as {
    input: SearchInput
    context: SearchContext
    events: SearchEvent
  },
  actions: {
    start: ({ context }, { req }: { req: SearchReq }) =>
      context.startCb(req.p, req.psvg),
    end: ({ context }, { res: { p, psvg, info } }: { res: SearchRes }) =>
      context.endCb(p, psvg, info),
  },
}).createMachine({
  id: 'search',
  context: ({ input }) => input,
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        SEARCH: {
          actions: {
            type: 'start',
            params: ({ event: { p, psvg } }) => ({
              req: { p, psvg },
            }),
          },
          target: 'Searching',
        },
      },
    },
    Searching: {
      on: {
        'SEARCH.DONE': {
          actions: {
            type: 'end',
            params: ({ event: { p, psvg, info } }) => ({
              res: { p, psvg, info },
            }),
          },
          target: 'Done',
        },
        'SEARCH.CANCEL': {
          target: 'Done',
        },
      },
    },
    Done: {
      always: 'Idle',
    },
  },
})

export type SearchMachine = typeof searchMachine

export type SearchState = StateFrom<typeof searchMachine>

export type SearchSend = (events: SearchEvent) => void

export type SearchRef = ActorRefFrom<typeof searchMachine>

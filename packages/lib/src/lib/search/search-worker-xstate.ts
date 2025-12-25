import { assign, createActor, emit, setup } from 'xstate'
import type { SearchGeoReq } from '../../types'
import { initAddresses, searchAddress } from './address'
import {
  type DoSearch,
  type SearchWorkerContext,
  type SearchWorkerReq,
} from './search-worker-types'

const searchWorkerMachine = setup({
  types: {
    events: {} as SearchWorkerReq,
    emitted: {} as DoSearch,
    context: {} as SearchWorkerContext,
  },
  actions: {
    initDone: () => postMessage({ type: 'INIT.DONE' }),
    doSearch: emit(({ context: { ctx } }, greq: Readonly<SearchGeoReq>) => ({
      type: 'SEARCH',
      ctx,
      greq,
    })),
  },
}).createMachine({
  context: { ctx: null },
  initial: 'Uninited',
  states: {
    Uninited: {
      on: {
        INIT: {
          actions: [
            assign({
              ctx: ({ event }) => initAddresses(event.entries),
            }),
            {
              type: 'initDone',
            },
          ],
          target: 'Inited',
        },
      },
    },
    Inited: {
      on: {
        SEARCH: [
          {
            actions: {
              type: 'doSearch',
              params: ({ event }) => event.greq,
            },
          },
        ],
      },
    },
  },
})

const searchWorkerActor = createActor(searchWorkerMachine)

export function searchWorkerActorStart(): void {
  searchWorkerActor.start()
}

export function searchWorkerActorSend(e: SearchWorkerReq): void {
  searchWorkerActor.send(e)
}

searchWorkerActor.on('SEARCH', ({ ctx, greq }) => {
  if (ctx === null) {
    // XXX
    postMessage({
      type: 'SEARCH.ERROR',
      error: 'ctx is null',
    })
    return
  }
  const res = searchAddress(ctx, greq)
  if (res === null) {
    // XXX
    postMessage({
      type: 'SEARCH.ERROR',
      error: 'address not found',
    })
    return
  }
  postMessage({
    type: 'SEARCH.DONE',
    res,
  })
})

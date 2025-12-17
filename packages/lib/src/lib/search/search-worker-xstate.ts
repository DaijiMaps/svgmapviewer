import { assign, createActor, setup } from 'xstate'
import { initAddresses, searchAddress } from './address'
import {
  type SearchWorkerContext,
  type SearchWorkerReq,
} from './search-worker-types'
import type { SearchContext } from './address-types'
import type { SearchGeoReq } from '../../types'

function doSearch(
  ctx: null | SearchContext,
  { pgeo, fidx }: Readonly<SearchGeoReq>
) {
  if (ctx === null) {
    // XXX
    postMessage({
      type: 'SEARCH.ERROR',
      error: 'ctx is null',
    })
    return
  }
  const res = searchAddress(ctx, pgeo, fidx)
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
}

const searchWorkerMachine = setup({
  types: {
    events: {} as SearchWorkerReq,
    context: {} as SearchWorkerContext,
  },
  actions: {
    initDone: () => postMessage({ type: 'INIT.DONE' }),
    doSearch: ({ context: { ctx } }, greq: Readonly<SearchGeoReq>) =>
      doSearch(ctx, greq),
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

searchWorkerActor.start()

export function searchWorkerActorSend(e: SearchWorkerReq): void {
  searchWorkerActor.send(e)
}

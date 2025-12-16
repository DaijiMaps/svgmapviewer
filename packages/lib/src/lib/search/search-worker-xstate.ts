import { assign, createActor, setup } from 'xstate'
import { type Vec } from '../vec'
import { initAddresses, searchAddress } from './address'
import {
  type SearchWorkerContext,
  type SearchWorkerReq,
} from './search-worker-types'

const searchWorkerMachine = setup({
  types: {
    events: {} as SearchWorkerReq,
    context: {} as SearchWorkerContext,
  },
  actions: {
    initDone: () => postMessage({ type: 'INIT.DONE' }),
    doSearch: ({ context: { ctx } }, { pgeo }: Readonly<{ pgeo: Vec }>) => {
      if (ctx === null) {
        return
      }
      const res = searchAddress(ctx, pgeo)
      if (res === null) {
        return
      }
      postMessage({
        type: 'SEARCH.DONE',
        res,
      })
    },
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
              params: ({ event: { pgeo } }) => ({
                pgeo,
              }),
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

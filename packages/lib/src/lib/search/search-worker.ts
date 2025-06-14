/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */

import { assign, createActor, setup } from 'xstate'
import type { Vec } from '../vec'
import { initAddresses, searchAddress } from './address'
import {
  type AddressEntries,
  type SearchAddressRes,
  type SearchContext,
} from './address-types'

type InitReq = { type: 'INIT'; entries: AddressEntries }
type SearchReq = { type: 'SEARCH'; pgeo: Vec }
export type SearchWorkerReq = InitReq | SearchReq
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchAddressRes }

interface SearchWorkerContext {
  ctx: null | SearchContext
}

const searchWorkerMachine = setup({
  types: {
    events: {} as InitReq | SearchReq,
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

onmessage = function (e: Readonly<MessageEvent<SearchWorkerReq>>) {
  searchWorkerActor.send(e.data)
}

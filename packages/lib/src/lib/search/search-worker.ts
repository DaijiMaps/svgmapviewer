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
type PostMessage = (e: Readonly<SearchWorkerRes>) => void

interface SearchWorkerContext {
  ctx: null | SearchContext
}

const searchWorkerMachine = setup({
  types: {
    events: {} as
      | (InitReq & { postMessage: PostMessage })
      | (SearchReq & { postMessage: PostMessage }),
    context: {} as SearchWorkerContext,
  },
  actions: {
    initDone: (_, { postMessage }: Readonly<{ postMessage: PostMessage }>) =>
      postMessage({ type: 'INIT.DONE' }),
    doSearch: (
      _,
      {
        postMessage,
        ctx,
        pgeo,
      }: Readonly<{
        postMessage: PostMessage
        ctx: null | SearchContext
        pgeo: Vec
      }>
    ) => {
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
      entry: () => console.log('Uninited!'),
      on: {
        INIT: {
          actions: [
            assign({
              ctx: ({ event }) => initAddresses(event.entries),
            }),
            {
              type: 'initDone',
              params: ({ event: { postMessage } }) => ({ postMessage }),
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
              params: ({ context: { ctx }, event: { postMessage, pgeo } }) => ({
                postMessage,
                ctx,
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
  searchWorkerActor.send({ ...e.data, postMessage: this.postMessage })
}

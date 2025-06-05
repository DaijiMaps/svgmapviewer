/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */

import type { Vec } from '../vec'
import { initAddresses, searchAddress } from './address'
import {
  type AddressEntries,
  type SearchAddressRes,
  type SearchContext,
} from './address-types'

let ctx: null | SearchContext = null

export type SearchWorkerReq =
  | { type: 'INIT'; entries: AddressEntries }
  | { type: 'SEARCH'; pgeo: Vec }
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchAddressRes }

onmessage = function (e: Readonly<MessageEvent<SearchWorkerReq>>) {
  if (e.data.type === 'INIT') {
    ctx = initAddresses(e.data.entries)
    this.postMessage({
      type: 'INIT.DONE',
    })
  } else if (e.data.type === 'SEARCH') {
    if (ctx === null) {
      return
    }
    const pgeo = e.data.pgeo
    const res = searchAddress(ctx, pgeo)
    if (res === null) {
      return
    }
    this.postMessage({
      type: 'SEARCH.DONE',
      res,
    })
  }
}

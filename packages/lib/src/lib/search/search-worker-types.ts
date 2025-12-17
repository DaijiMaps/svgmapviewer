import type { SearchGeoReq } from '../../types'
import {
  type AddressEntries,
  type SearchAddress,
  type SearchContext,
} from './address-types'

export type SearchWorkerReq =
  | { type: 'INIT'; entries: AddressEntries }
  | { type: 'SEARCH'; greq: SearchGeoReq }
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchAddress }
  | { type: 'SEARCH.ERROR'; error: string }

export interface SearchWorkerContext {
  ctx: null | SearchContext
}

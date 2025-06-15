import type { VecVec } from '../vec/prefixed'
import type {
  AddressEntries,
  SearchAddressRes,
  SearchContext,
} from './address-types'

export type SearchWorkerReq =
  | { type: 'INIT'; entries: AddressEntries }
  | { type: 'SEARCH'; pgeo: VecVec }
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchAddressRes }

export interface SearchWorkerContext {
  ctx: null | SearchContext
}

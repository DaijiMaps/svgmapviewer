import type { SearchGeoReq } from '../../types'
import { type SearchEntries, type SearchPos, type SearchContext } from './types'

export type SearchWorkerReq =
  | { type: 'INIT'; entries: SearchEntries }
  | { type: 'SEARCH'; greq: SearchGeoReq }
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchPos }
  | { type: 'SEARCH.ERROR'; error: string }

export interface SearchWorkerContext {
  ctx: null | SearchContext
}

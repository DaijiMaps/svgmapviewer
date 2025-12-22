import type { SearchGeoReq } from '../../types'
import { type SearchContext, type SearchPos } from './types'

export type SearchWorkerReq =
  | { type: 'INIT'; entries: readonly SearchPos[] }
  | { type: 'SEARCH'; greq: SearchGeoReq }
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchPos }
  | { type: 'SEARCH.ERROR'; error: string }

export interface SearchWorkerContext {
  ctx: null | SearchContext
}

/* eslint-disable functional/no-return-void */
import type { SearchGeoReq } from '../../types'
import { type SearchContext, type SearchPos } from './types'

export type SearchWorkerReq =
  | { type: 'INIT'; entries: readonly SearchPos[] }
  | { type: 'SEARCH'; greq: SearchGeoReq }
export type SearchWorkerRes =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH.DONE'; res: SearchPos }
  | { type: 'SEARCH.ERROR'; error: string }

export type DoSearch = {
  type: 'SEARCH'
  ctx: null | SearchContext
  greq: Readonly<SearchGeoReq>
}

export interface SearchWorkerContext {
  ctx: null | SearchContext
}

// eslint-disable-next-line functional/no-mixed-types
export interface SearchWorker extends Omit<
  Worker,
  'postMessage' | 'onmessage'
> {
  postMessage(message: Readonly<SearchWorkerReq>): void
  onmessage: null | ((event: Readonly<MessageEvent<SearchWorkerRes>>) => void)
}

// eslint-disable-next-line functional/no-mixed-types
export interface DedicatedSearchWorker extends Omit<
  DedicatedWorkerGlobalScope,
  'postMessage' | 'onmessage'
> {
  postMessage: {
    (
      message: Readonly<SearchWorkerRes>,
      transfer?: Readonly<Transferable[]>
    ): void
    (
      message: Readonly<SearchWorkerRes>,
      options?: Readonly<StructuredSerializeOptions>
    ): void
  }
  onmessage: ((event: Readonly<MessageEvent<SearchWorkerReq>>) => void) | null
}

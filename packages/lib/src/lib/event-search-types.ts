import type { SearchData, SearchReq, SearchRes } from '../types'
import type { Cb1 } from './cb'

export type SearchStartCb = Cb1<Readonly<SearchReq>>
export type SearchCb = Cb1<Readonly<SearchReq>>
export type SearchDoneCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndDoneCb = Cb1<Readonly<SearchData>>

export interface SearchCbs {
  start: Set<SearchStartCb>
  request: Set<SearchCb>
  requestDone: Set<SearchDoneCb>
  end: Set<SearchEndCb>
  endDone: Set<SearchEndDoneCb>
}

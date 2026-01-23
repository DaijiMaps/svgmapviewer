import type { SearchData, SearchSvgReq, SearchRes } from '../types'
import type { Cb1 } from './cb'

export type SearchStartCb = Cb1<Readonly<SearchSvgReq>>
export type SearchCb = Cb1<Readonly<SearchSvgReq>>
export type SearchDoneCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndDoneCb = Cb1<Readonly<SearchData>>

export interface SearchCbs {
  readonly start: Set<SearchStartCb>
  readonly end: Set<SearchEndCb>
  readonly endDone: Set<SearchEndDoneCb>
}

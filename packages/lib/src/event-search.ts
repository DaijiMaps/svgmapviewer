/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type { SearchCbs } from './event-search-types'
import { notifyCbs } from './lib/cb'
import type { SearchData, SearchReq, SearchRes } from './types'

export const searchCbs: SearchCbs = {
  start: new Set(),
  request: new Set(),
  requestDone: new Set(),
  end: new Set(),
  endDone: new Set(),
}

export function notifySearchStart(req: Readonly<SearchReq>): void {
  notifyCbs(searchCbs.start, req)
}
export function notifySearchRequest(req: Readonly<SearchReq>): void {
  notifyCbs(searchCbs.request, req)
}
export function notifySearchRequestDone(res: Readonly<null | SearchRes>): void {
  notifyCbs(searchCbs.requestDone, res)
}
export function notifySearchEnd(res: Readonly<null | SearchRes>): void {
  notifyCbs(searchCbs.end, res)
}
export function notifySearchEndDone(data: Readonly<SearchData>): void {
  notifyCbs(searchCbs.endDone, data)
}

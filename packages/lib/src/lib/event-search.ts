/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type { SearchData, SearchSvgReq, SearchRes } from '../types'
import type { SearchCbs } from './event-search-types'

import { notifyCbs } from './cb'

export const searchCbs: SearchCbs = {
  start: new Set(),
  request: new Set(),
  requestDone: new Set(),
  end: new Set(),
  endDone: new Set(),
}

export const notifySearch = {
  start: (req: Readonly<SearchSvgReq>): void => notifyCbs(searchCbs.start, req),
  request: (req: Readonly<SearchSvgReq>): void =>
    notifyCbs(searchCbs.request, req),
  requestDone: (res: Readonly<null | SearchRes>): void =>
    notifyCbs(searchCbs.requestDone, res),
  end: (res: Readonly<null | SearchRes>): void => notifyCbs(searchCbs.end, res),
  endDone: (data: Readonly<SearchData>): void =>
    notifyCbs(searchCbs.endDone, data),
}

export function notifySearchStart(req: Readonly<SearchSvgReq>): void {
  notifyCbs(searchCbs.start, req)
}

export function notifySearchRequest(req: Readonly<SearchSvgReq>): void {
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

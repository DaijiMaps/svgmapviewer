/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createActor } from 'xstate'
import { notifySearch, notifySearchEnd } from './config'
import { searchMachine } from './search-xstate'
import { type SearchRes } from './types'
import { type Vec } from './vec'

export const searchRef = createActor(searchMachine)

searchRef.on('SEARCH', ({ psvg }) => notifySearch(psvg))
searchRef.on('SEARCH.DONE', ({ psvg, info }) => notifySearchEnd(psvg, info))

export function searchSearchStart(psvg: Vec): void {
  searchRef.send({ type: 'SEARCH', psvg })
}

export function searchSearchDone(res: Readonly<null | SearchRes>): void {
  searchRef.send(
    res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', ...res }
  )
}

searchRef.start()

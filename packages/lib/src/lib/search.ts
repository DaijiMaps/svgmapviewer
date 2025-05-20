/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createActor } from 'xstate'
import { configActor } from './config'
import { searchMachine } from './search-xstate'
import { SearchRes } from './types'
import { Vec } from './vec'

export const searchRef = createActor(searchMachine)

searchRef.on('SEARCH', ({ psvg }) => {
  configActor.getSnapshot().context.searchCbs.forEach((cb) => cb(psvg))
})

searchRef.on('SEARCH.DONE', ({ /*p,*/ psvg, info }) => {
  // XXX send searchEndCbs to pointer
  // XXX pointer calcs p (client coord) from psvg
  configActor
    .getSnapshot()
    .context.searchEndCbs.forEach((cb) => cb({ psvg, info }))
})

export function searchSearchStart(psvg: Vec) {
  searchRef.send({ type: 'SEARCH', psvg })
}

export function searchSearchDone(res: Readonly<null | SearchRes>) {
  searchRef.send(
    res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', ...res }
  )
}

searchRef.start()

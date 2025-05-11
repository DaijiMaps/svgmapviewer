/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createActor } from 'xstate'
import { svgMapViewerConfig as cfg } from './config'
import { fromSvg } from './layout'
import { searchMachine } from './search-xstate'
import { SearchRes } from './types'
import { Vec } from './vec'

export const searchRef = createActor(searchMachine)

searchRef.on('SEARCH', ({ psvg }) => {
  cfg.searchCbs.forEach((cb) => cb(psvg))
})

searchRef.on('SEARCH.DONE', ({ /*p,*/ psvg, info }) => {
  const p = fromSvg(psvg)
  cfg.searchEndCbs.forEach((cb) => cb({ psvg, info }))
  cfg.uiOpenCbs.forEach((cb) => cb(p, psvg, info))
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

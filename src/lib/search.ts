/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createActor } from 'xstate'
import { svgMapViewerConfig } from './config'
import { SearchRes } from './types'
import { Vec } from './vec'
import { searchMachine } from './xstate-search'

export const searchRef = createActor(searchMachine)

searchRef.on('START', ({ p, psvg }) => {
  svgMapViewerConfig.searchCbs.forEach((cb) => cb(p, psvg))
})

searchRef.on('END', ({ p, psvg, info }) => {
  svgMapViewerConfig.searchEndCbs.forEach((cb) => cb({ p, psvg, info }))
  svgMapViewerConfig.uiOpenCbs.forEach((cb) => cb(p, psvg, info))
})

export function searchSearchStart(p: Vec, psvg: Vec) {
  searchRef.send({ type: 'SEARCH', p, psvg })
}

export function searchSearchDone(res: Readonly<null | SearchRes>) {
  searchRef.send(
    res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', ...res }
  )
}

searchRef.start()

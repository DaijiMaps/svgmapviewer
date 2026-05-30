/* eslint-disable functional/no-expression-statements */
import { createAtom } from '@xstate/store'

import { svgMapViewerConfig } from '../../config'
import { type Info } from '../../types'
import {
  //namesToNameMap,
  namesToRNameMap,
  type NameMap,
  type Names,
} from '../address'
import type { SearchPos } from './types'

//const nameMapAtom = createAtom<null | NameMap>(null)
const addressMapAtom = createAtom<null | NameMap>(null)

/*
const getNameMap = (names: Names) => {
  const tmp = nameMapAtom.get()
  if (tmp !== null) return tmp
  const v = namesToNameMap(names)
  nameMapAtom.set(v)
  return v
}
*/
const getAddressMap = (names: Names) => {
  const tmp = addressMapAtom.get()
  if (tmp !== null) return tmp
  const v = namesToRNameMap(names)
  addressMapAtom.set(v)
  return v
}

export const getSearchInfoCommon = (pos: Readonly<SearchPos>): null | Info => {
  const searchNames = svgMapViewerConfig.searchNames
  const getInfoByName = svgMapViewerConfig.getInfoByName
  if (searchNames === undefined || getInfoByName === undefined) return null
  const names = searchNames.map((e) => [e.name, e.addresses]) satisfies Names
  //const nameMap = getNameMap(names)
  const addressMap = getAddressMap(names)
  const xs = addressMap.get(pos.address)
  if (xs === undefined || xs.size < 1) {
    return null
  }
  const x = Array.from(xs)[0]
  const res: Info = getInfoByName(x)
  return res satisfies Info
}

/* eslint-disable functional/no-expression-statements */
import { createAtom } from '@xstate/store'

import { svgMapViewerConfig as cfg } from '../../config'
import { type Info } from '../../types'
import {
  //namesToNameMap,
  namesToRNameMap,
  type NameMap,
  type Names,
  type SearchAddress,
  type SearchInfo,
  type SearchName,
} from '../address'

const namesAtom = createAtom<null | Names>(null)

const getNames = (searchNames: readonly SearchName[]) => {
  const tmp = namesAtom.get()
  if (tmp !== null) return tmp
  const v = searchNames.map((e) => [e.name, e.addresses]) satisfies Names
  namesAtom.set(v)
  return v
}

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

const infoMapAtom = createAtom<null | Map<string, Info>>(null)

const getInfoMap = (infos: readonly SearchInfo[]) => {
  const tmp = infoMapAtom.get()
  if (tmp !== null) return tmp
  const m = new Map(infos.map((si) => [si.name, si.info] as const))
  infoMapAtom.set(m)
  return m
}

export const makeGetInfoByName =
  (searchInfos: typeof cfg.searchInfos) =>
  (name: string): Info | null => {
    const m = getInfoMap(searchInfos ?? [])
    return m.get(name) || null
  }

type GetInfoByName = NonNullable<typeof cfg.getInfoByName>

const getInfoByNameAtom = createAtom<null | GetInfoByName>(null)

// eslint-disable-next-line functional/functional-parameters
const getGetInfoByName = () => {
  if (cfg.getInfoByName) return cfg.getInfoByName
  const tmp = getInfoByNameAtom.get()
  if (tmp !== null) return tmp
  const f = makeGetInfoByName(cfg.searchInfos ?? [])
  getInfoByNameAtom.set(f)
  return f
}

export const getSearchInfoCommon = (
  pos: Readonly<SearchAddress>
): null | Info => {
  const searchNames = cfg.searchNames
  const getInfoByName = getGetInfoByName()
  if (searchNames === undefined || getInfoByName === undefined) return null
  const names = getNames(searchNames)
  //const nameMap = getNameMap(names)
  const addressMap = getAddressMap(names)
  const xs = addressMap.get(pos.address)
  if (xs === undefined || xs.size < 1) {
    return null
  }
  const x = Array.from(xs)[0]
  const res: Info | null = getInfoByName(x)
  return res
}

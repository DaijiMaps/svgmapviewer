/* eslint-disable functional/no-throw-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { svgMapViewerConfig } from '../../config'
import { type Info } from '../../types'
import {
  namesToNameMap,
  namesToRNameMap,
  type NameMap,
  type Names,
} from '../address'
import type { SearchPos } from './types'

const nameAddressStringMapRef: Set<NameMap> = new Set()
const addressStringNameMapRef: Set<NameMap> = new Set()

export const getSearchInfoCommon = (pos: Readonly<SearchPos>): null | Info => {
  const searchNames = svgMapViewerConfig.searchNames
  const getInfoByName = svgMapViewerConfig.getInfoByName
  if (searchNames === undefined || getInfoByName === undefined) return null
  const names = searchNames.map((e) => [e.name, e.addresses]) satisfies Names
  if (nameAddressStringMapRef.size === 0) {
    const v = namesToNameMap(names)
    nameAddressStringMapRef.add(v)
  }
  if (addressStringNameMapRef.size === 0) {
    const v = namesToRNameMap(names)
    addressStringNameMapRef.add(v)
  }
  const ms = Array.from(addressStringNameMapRef)
  if (ms.length !== 1) throw new Error(`getInfo`)
  const m = ms[0]
  const xs = m.get(pos.address)
  if (xs === undefined || xs.size < 1) {
    return null
  }
  const x = Array.from(xs)[0]
  const res: Info = getInfoByName(x)
  return res satisfies Info
}

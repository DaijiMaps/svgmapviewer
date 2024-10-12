import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import { initAddresses, searchAddress } from './address'
import { addressEntries } from './address-data'
import { searchInfo } from './data'
import { Info } from './info'

const ctx = initAddresses(addressEntries)

onmessage = function (e: Readonly<MessageEvent<{ p: Vec; pgeo: Vec }>>) {
  const p = e.data.p
  const pgeo = e.data.pgeo

  const loc = searchAddress(ctx, pgeo)

  const info = loc === null ? null : searchInfo(loc.address, loc.lonlat)

  const res: null | { p: Vec; pgeo: Vec; info: Info } =
    loc === null || info === null ? null : { p, pgeo: loc.lonlat, info }

  if (addressEntries === null) {
    this.postMessage(null)
  }
  this.postMessage(res)
}

import { Info } from '@daijimaps/svgmapviewer'
import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import Flatbush from 'flatbush'
import { addressEntries } from './data'

type Address = string
type Idx = string

type FlatbushIndexes = Record<Idx, Address>

interface AddressBuf {
  fb: Flatbush
  idxs: FlatbushIndexes
}

function makeAddressBuf() {
  const l = addressEntries.length
  const fb: Flatbush = new Flatbush(l)
  const idxs: FlatbushIndexes = {}
  for (const {
    a,
    lonlat: { x, y },
  } of addressEntries) {
    const idx = fb.add(x, y)
    idxs[`${idx}`] = a
  }
  fb.finish()
  return {
    fb,
    idxs,
  }
}

const b: AddressBuf = makeAddressBuf()
const m: Map<Address, Vec> = new Map(
  addressEntries.map(({ a, lonlat }) => [a, lonlat])
)

interface SearchAddressRes {
  address: Address
  pp: Vec
}

export function searchAddress(pgeo: Vec): SearchAddressRes | null {
  const { fb, idxs } = b
  const ns = fb.neighbors(pgeo.x, pgeo.y, 1, 100)
  if (ns.length === 0) {
    return null
  }
  const n = ns[0]
  const address = idxs[`${n}`]
  const pp = m.get(address)
  if (pp === undefined) {
    return null
  }
  return { address, pp }
}

onmessage = function (e: Readonly<MessageEvent<{ p: Vec; pgeo: Vec }>>) {
  const p = e.data.p
  const pgeo = e.data.pgeo

  const xxx = searchAddress(pgeo)

  const res: null | { p: Vec; pgeo: Vec; info: Info } =
    xxx === null
      ? null
      : {
          p,
          pgeo: xxx.pp,
          info: {
            title: `Found: POI: ${p.x},${p.y} (${xxx.pp.x},${xxx.pp.y})`,
            x: {
              tag: 'shop',
              name: `${xxx.address} @ ${xxx.pp.x}, ${xxx.pp.y}`,
              address: xxx.address,
            },
          },
        }

  this.postMessage(res)
}

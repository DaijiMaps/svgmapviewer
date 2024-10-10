/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { SearchReq, SearchRes, VecVec as Vec } from '@daijimaps/svgmapviewer'
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
  // eslint-disable-next-line functional/no-loop-statements
  for (const { a, psvg } of addressEntries) {
    const idx = fb.add(psvg.x, psvg.y)
    // eslint-disable-next-line functional/immutable-data
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
  addressEntries.map(({ a, psvg }) => [a, psvg])
)

interface SearchAddressRes {
  address: Address
  pp: Vec
}

export function searchAddress(psvg: Vec): SearchAddressRes | null {
  const { fb, idxs } = b
  const ns = fb.neighbors(psvg.x, psvg.y, 1, 100)
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

onmessage = function (e: Readonly<MessageEvent<SearchReq>>) {
  const p = e.data.p
  const psvg = e.data.psvg

  const xxx = searchAddress(psvg)

  const res: null | SearchRes =
    xxx === null
      ? null
      : {
          p,
          psvg: xxx.pp,
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

import type { FloorsConfig } from '../../../types'

export type Context = { cfg?: FloorsConfig }

export type Init = { type: 'INIT'; cfg: FloorsConfig }
export type InitDone = { type: 'INIT.DONE' }
export type Fetch = { type: 'FETCH'; cfg: FloorsConfig }
export type FetchDone = {
  type: 'FETCH.DONE'
  idx: number
  blob: Blob
  buf: ArrayBuffer
}
export type Noop = { type: 'NOOP' }

////

export type Req = Init
export type Res = InitDone | FetchDone

export type Events = Req
export type Emits = Res | Fetch | Noop

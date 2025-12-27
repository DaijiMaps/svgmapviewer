/* eslint-disable functional/no-return-void */
import type { FloorsConfig } from '../../../types'

export type Context = { cfg?: FloorsConfig }

export type Init = { type: 'INIT'; cfg: FloorsConfig }
export type InitDone = { type: 'INIT.DONE' }
export type Fetch = { type: 'FETCH'; cfg: FloorsConfig }
export type FetchDone = {
  type: 'FETCH.DONE'
  fidx: number
  blob: Blob
  buf: ArrayBuffer
}
export type Noop = { type: 'NOOP' }

////

export type Req = Init
export type Res = InitDone | FetchDone

export type Events = Req
export type Emits = Res | Fetch | Noop

// eslint-disable-next-line functional/no-mixed-types
export interface FloorsWorker extends Omit<
  Worker,
  'postMessage' | 'onmessage'
> {
  postMessage(message: Readonly<Req>): void
  onmessage: null | ((event: Readonly<MessageEvent<Res>>) => void)
}

// eslint-disable-next-line functional/no-mixed-types
export interface FloorsWorkerContext extends Omit<
  DedicatedWorkerGlobalScope,
  'postMessage' | 'onmessage'
> {
  postMessage: {
    (message: Readonly<Res>, transfer?: Readonly<Transferable[]>): void
    (
      message: Readonly<Res>,
      options?: Readonly<StructuredSerializeOptions>
    ): void
  }
  onmessage: ((event: Readonly<MessageEvent<Req>>) => void) | null
}

import type { DedicatedSearchWorker } from './search-worker-types'

export const x: DedicatedSearchWorker = self as unknown as DedicatedSearchWorker

import type { FloorsWorkerContext } from './floors-worker-types'

export const ctx: FloorsWorkerContext = self as unknown as FloorsWorkerContext

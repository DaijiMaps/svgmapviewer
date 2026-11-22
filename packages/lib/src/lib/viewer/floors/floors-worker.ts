/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { floorCbs } from '../../event-floor'
import { floorsSend } from './floors-xstate'
import type { FloorsWorker, Res } from './worker/floors-worker-types'

// worker

export const worker: FloorsWorker = new Worker(
  new URL('./worker/floors-worker-main.js', import.meta.url),
  { type: 'module' }
) as unknown as FloorsWorker

worker.onmessage = (e: Readonly<MessageEvent<Res>>): void => {
  const ev = e.data
  switch (ev.type) {
    case 'INIT.DONE': {
      break
    }
    case 'FETCH.DONE': {
      const { name, blob } = ev
      floorsSend({
        type: 'IMAGE',
        name,
        url: URL.createObjectURL(blob),
      })
      break
    }
  }
}

worker.onerror = (ev) => {
  console.error('floors error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('floors messageerror', ev)
}

export function floorsWorkerCbsStart(): void {
  floorCbs.init.add(({ fcfg, base }) => {
    worker.postMessage({
      type: 'INIT',
      fcfg,
      base,
    })
  })
}

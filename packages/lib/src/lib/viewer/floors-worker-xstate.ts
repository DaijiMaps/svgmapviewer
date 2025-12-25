import { createActor, setup } from 'xstate'
import type { Context, Req, Res } from './floors-worker-types'

const floorsWorkerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Req,
    emitted: {} as Res,
  },
}).createMachine({
  id: 'floorsWorker1',
  context: {
    fidx: 0,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        INIT: {
          target: 'Busy',
        },
      },
    },
    Busy: {},
  },
})

const floorsWorkerActor = createActor(floorsWorkerMachine)

export function floorsWorkerStart(): void {
  floorsWorkerActor.start()
}

export function floorsWorkerSend(ev: Req): void {
  floorsWorkerActor.send(ev)
}

floorsWorkerActor.on('INIT.DONE', (ev) => {
  postMessage(ev)
})

import { assign, createActor, emit, setup } from 'xstate'

import { ctx } from './floors-worker-context'
import type { Context, Emits, Events, Req } from './floors-worker-types'

const floorsWorkerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    emitted: {} as Emits,
  },
  actions: {
    fetch: emit(
      ({ context: { cfg, base } }): Emits =>
        cfg === undefined ? { type: 'NOOP' } : { type: 'FETCH', cfg, base }
    ),
  },
}).createMachine({
  id: 'floorsWorker1',
  context: {
    cfg: undefined,
  },
  initial: 'Uninited',
  states: {
    Uninited: {
      on: {
        INIT: {
          actions: [
            emit({ type: 'INIT.DONE' }),
            assign(({ event: { cfg, base } }) => ({ cfg, base })),
          ],
          target: 'LoadingFirst',
        },
      },
    },
    LoadingFirst: {
      entry: 'fetch',
    },
    LoadingRest: {},
    Idle: {},
  },
})

const floorsWorkerActor = createActor(floorsWorkerMachine)

export function floorsWorkerStart(): void {
  floorsWorkerActor.start()
}

export function floorsWorkerSend(ev: Req): void {
  floorsWorkerActor.send(ev)
}

floorsWorkerActor.on('INIT.DONE', (ev) => ctx.postMessage(ev))
floorsWorkerActor.on('FETCH', ({ cfg, base }) =>
  cfg.floors.forEach((f, fidx) => {
    fetch((base ?? '') + f.href)
      .then((response) => {
        if (!response.ok) {
          // XXX retry?
          throw new Error(`fetch error!`)
        }
        return response.blob()
      })
      .then((blob) =>
        blob
          .arrayBuffer()
          .then((buf) =>
            ctx.postMessage(
              { type: 'FETCH.DONE', fidx, blob, buf },
              { transfer: [buf] }
            )
          )
      )
      .catch((e) => console.error(e))
  })
)

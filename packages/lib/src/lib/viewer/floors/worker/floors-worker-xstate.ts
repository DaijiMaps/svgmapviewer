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
    fetch: emit(({ context: { fcfg, base } }): Emits =>
      fcfg === undefined ? { type: 'NOOP' } : { type: 'FETCH', fcfg, base }
    ),
  },
}).createMachine({
  id: 'floorsWorker1',
  context: {
    fcfg: undefined,
  },
  initial: 'Uninited',
  states: {
    Uninited: {
      on: {
        INIT: {
          actions: [
            emit({ type: 'INIT.DONE' }),
            assign(({ event: { fcfg, base } }) => ({ fcfg, base })),
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
floorsWorkerActor.on('FETCH', ({ fcfg, base }) =>
  fcfg.floors
    .concat(fcfg.layers ?? [])
    .forEach(({ name, href }) => fetchImage(name, href, base))
)

const fetchImage = (name: string, href: string | URL, base?: string): void => {
  // XXX
  // XXX
  // XXX
  // XXX de-duplicate slashes
  const url = ((base ?? '') + href).replace(/\/+/g, '/')
  // XXX
  // XXX
  // XXX
  fetch(url)
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
            { type: 'FETCH.DONE', name, blob, buf },
            { transfer: [buf] }
          )
        )
    )
    .catch((e) => console.error(e))
}

import { assign, createActor, emit, setup } from 'xstate'

import { floorUrls, prefixUrl } from '../floors-types'
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
  floorUrls(fcfg).forEach(({ name, href }) => fetchImage(name, href, base))
)

const fetchImage = (name: string, href: string | URL, base?: string): void => {
  const url = prefixUrl(href, base)
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`fetch error!`)
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
    // XXX retry?
    .catch((e) => console.error(e))
}

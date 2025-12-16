import { assign, createActor, emit, fromPromise, setup } from 'xstate'
import { type BoxBox as Box } from '../box/prefixed'
import { getScroll, syncScroll } from './scroll'
import {
  type GetDone,
  type ScrollContext,
  type ScrollEmitted,
  type ScrollEvent,
  type SlideDone,
  type SyncSyncDone,
} from './scroll-types'

const scrollMachine = setup({
  types: {} as {
    events: ScrollEvent
    emitted: ScrollEmitted
    context: ScrollContext
  },
  actions: {
    getScroll: assign({ scroll: () => getScroll() }),
    syncScroll: (_, { pos }: { pos: Box }) => syncScroll(pos),
  },
  actors: {
    syncScrollLogic: fromPromise<boolean, null | Box>(async ({ input }) => {
      if (input === null) {
        throw new Error('input is null')
      }
      const ok = syncScroll(input)
      if (!ok) {
        throw new Error('syncScroll failed')
      }
      return true
    }),
  },
}).createMachine({
  id: 'scroll',
  initial: 'Idle',
  context: { dest: null, scroll: null },
  states: {
    Idle: {
      on: {
        SYNC: {
          actions: [
            {
              type: 'syncScroll',
              params: ({ event }) => ({
                pos: event.pos,
              }),
            },
          ],
        },
        GET: {
          actions: [
            'getScroll',
            emit(({ context: { scroll } }) => ({
              type: 'SCROLL.GET.DONE',
              scroll,
            })),
          ],
        },
        SYNCSYNC: {
          actions: assign({
            dest: ({ event }) => event.pos,
          }),
          target: 'Syncing',
        },
      },
    },
    Syncing: {
      invoke: [
        {
          src: 'syncScrollLogic',
          systemId: 'syncscroll1',
          input: ({ context }) => context.dest,
          onDone: {
            actions: [
              'getScroll',
              emit(({ context: { scroll } }) => ({
                type: 'SCROLL.SYNCSYNC.DONE',
                scroll,
              })),
              assign({
                dest: null,
              }),
            ],
            target: 'Idle',
          },
          onError: {
            target: 'Retrying',
          },
        },
      ],
    },
    Retrying: {
      after: {
        1000: {
          // re-enter to re-invoke
          target: 'Syncing',
        },
      },
    },
  },
})

export type SlideDoneCb = (ev: SlideDone) => void
export type GetDoneCb = (ev: GetDone) => void
export type SyncSyncDoneCb = (ev: SyncSyncDone) => void
export type ScrollCbs = {
  slideDoneCbs: Set<SlideDoneCb>
  getDoneCbs: Set<GetDoneCb>
  syncSyncDoneCbs: Set<SyncSyncDoneCb>
}

export const scrollCbs: ScrollCbs = {
  slideDoneCbs: new Set(),
  getDoneCbs: new Set(),
  syncSyncDoneCbs: new Set(),
}

const scrollActor = createActor(scrollMachine, {
  systemId: 'system-scroll1',
})

scrollActor.on('SCROLL.SLIDE.DONE', (ev) =>
  scrollCbs.slideDoneCbs.forEach((cb) => cb(ev))
)
scrollActor.on('SCROLL.GET.DONE', (ev) =>
  scrollCbs.getDoneCbs.forEach((cb) => cb(ev))
)
scrollActor.on('SCROLL.SYNCSYNC.DONE', (ev) =>
  scrollCbs.syncSyncDoneCbs.forEach((cb) => cb(ev))
)

export function scrollActorStart(): void {
  scrollActor.start()
}

export function scrollSend(ev: ScrollEvent): void {
  scrollActor.send(ev)
}

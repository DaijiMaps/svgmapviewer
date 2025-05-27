import { assign, createActor, emit, fromPromise, setup } from 'xstate'
import { type BoxBox as Box, type BoxBox } from './box/prefixed'
import { getScroll, syncScroll } from './scroll'

type ScrollGet = {
  type: 'GET'
}
type ScrollEventSync = {
  type: 'SYNC'
  pos: Box
}
type ScrollEventSyncSync = {
  type: 'SYNCSYNC'
  pos: Box
}

export type ScrollEvent = ScrollGet | ScrollEventSync | ScrollEventSyncSync

export type SlideDone = { type: 'SCROLL.SLIDE.DONE' }
export type GetDone = { type: 'SCROLL.GET.DONE'; scroll: null | BoxBox }
export type SyncSyncDone = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: null | BoxBox
}
export type ScrollEmitted = SlideDone | GetDone | SyncSyncDone

export interface ScrollContext {
  dest: null | Box
  scroll: null | Box
}

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
        100: {
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

export const slideDoneCbs: Set<SlideDoneCb> = new Set<SlideDoneCb>()
export const getDoneCbs: Set<GetDoneCb> = new Set<GetDoneCb>()
export const syncSyncDoneCbs: Set<SyncSyncDoneCb> = new Set<SyncSyncDoneCb>()

const scrollActor = createActor(scrollMachine, {
  systemId: 'system-scroll1',
})

scrollActor.on('SCROLL.SLIDE.DONE', (ev) =>
  slideDoneCbs.forEach((cb) => cb(ev))
)
scrollActor.on('SCROLL.GET.DONE', (ev) => getDoneCbs.forEach((cb) => cb(ev)))
scrollActor.on('SCROLL.SYNCSYNC.DONE', (ev) =>
  syncSyncDoneCbs.forEach((cb) => cb(ev))
)

export function scrollStart(): void {
  scrollActor.start()
}

export function scrollSend(ev: ScrollEvent): void {
  scrollActor.send(ev)
}

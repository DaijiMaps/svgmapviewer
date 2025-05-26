import { assign, createActor, fromPromise, sendTo, setup } from 'xstate'
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
export type GetDone = { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
export type SyncSyncDone = { type: 'SCROLL.SYNCSYNC.DONE'; scroll: BoxBox }
export type ScrollEmitted = SlideDone | GetDone | SyncSyncDone

export interface ScrollContext {
  dest: null | Box
}

const scrollMachine = setup({
  types: {} as {
    events: ScrollEvent
    emitted: ScrollEmitted
    context: ScrollContext
  },
  actions: {
    syncScroll: (_, { pos }: { pos: Box }) => syncScroll(pos),
    // XXX emit
    notifySlideDone: sendTo(
      ({ system }) => system.get('system-pointer1'),
      () => ({ type: 'SCROLL.SLIDE.DONE' })
    ),
    // XXX emit
    notifyGetDone: sendTo(
      ({ system }) => system.get('system-pointer1'),
      () => ({
        type: 'SCROLL.GET.DONE',
        scroll: getScroll(),
      })
    ),
    // XXX emit
    notifySyncSyncDone: sendTo(
      ({ system }) => system.get('system-pointer1'),
      () => ({
        type: 'SCROLL.SYNCSYNC.DONE',
        scroll: getScroll(),
      })
    ),
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
  context: { dest: null },
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
          actions: {
            type: 'notifyGetDone',
          },
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
              'notifySyncSyncDone',
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

//type ScrollActorRef = ActorRefFrom<typeof scrollMachine>

export type SlideDoneCb = (ev: SlideDone) => void
export type GetDoneCb = (ev: GetDone) => void
export type SyncSyncDoneCb = (ev: SyncSyncDone) => void

export const slideDoneCbs: Set<SlideDoneCb> = new Set<SlideDoneCb>()
export const getDoneCbs: Set<GetDoneCb> = new Set<GetDoneCb>()
export const syncSyncDoneCbs: Set<SyncSyncDoneCb> = new Set<SyncSyncDoneCb>()

const scrollActor = createActor(scrollMachine)

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

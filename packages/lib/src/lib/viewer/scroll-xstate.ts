import { assign, createActor, emit, fromPromise, setup } from 'xstate'
import { type BoxBox } from '../box/prefixed'
import { getScroll, syncScroll } from './scroll'
import {
  type ScrollContext,
  type ScrollEmitted,
  type ScrollEvent,
} from './scroll-types'
import {
  notifyScrollGetDone,
  notifyScrollSyncSyncDone,
  scrollCbs,
} from '../../event'

const scrollMachine = setup({
  types: {} as {
    events: ScrollEvent
    emitted: ScrollEmitted
    context: ScrollContext
  },
  actions: {
    getScroll: assign({ scroll: () => getScroll() }),
    syncScroll: (_, { pos }: { pos: BoxBox }) => syncScroll(pos),
  },
  actors: {
    syncScrollLogic: fromPromise<boolean, null | BoxBox>(async ({ input }) => {
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

const scrollActor = createActor(scrollMachine, {
  systemId: 'system-scroll1',
})

export function scrollSend(ev: ScrollEvent): void {
  scrollActor.send(ev)
}

scrollActor.on('SCROLL.GET.DONE', ({ scroll }) => notifyScrollGetDone(scroll))
scrollActor.on('SCROLL.SYNCSYNC.DONE', ({ scroll }) =>
  notifyScrollSyncSyncDone(scroll)
)

export function scrollCbsStart2(): void {
  scrollCbs.sync.add((pos: Readonly<BoxBox>): void =>
    scrollSend({ type: 'SYNC', pos })
  )
  scrollCbs.syncSync.add((pos: Readonly<BoxBox>): void =>
    scrollSend({ type: 'SYNCSYNC', pos })
  )
  scrollCbs.get.add((): void => scrollSend({ type: 'GET' }))
}

export function scrollActorStart(): void {
  scrollActor.start()
}

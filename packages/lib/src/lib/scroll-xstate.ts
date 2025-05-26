import { type ActorRefFrom, assign, fromPromise, sendTo, setup } from 'xstate'
import { type BoxBox as Box } from './box/prefixed'
import { getScroll, syncScroll } from './scroll'
import { stepMachine } from './step-xstate'

const syncScrollLogic = fromPromise<boolean, Box>(async ({ input }) => {
  const ok = syncScroll(input)
  if (!ok) {
    throw new Error('syncScroll failed')
  }
  return true
})

type ScrollEventSync = {
  type: 'SYNC'
  pos: Box
}
type ScrollEventSlide = {
  type: 'SLIDE'
  P: Box
  Q: Box
}
type ScrollEventCancel = {
  type: 'CANCEL'
  pos: Box
}
type ScrollEventStepDone = {
  type: 'STEP.DONE'
  count: number
}
type ScrollEventSyncSync = {
  type: 'SYNCSYNC'
  pos: Box
}

export type ScrollEvent =
  | ScrollEventSync
  | ScrollEventSlide
  | ScrollEventCancel
  | ScrollEventStepDone
  | ScrollEventSyncSync

export interface ScrollContext {
  dest: null | Box
}

export const scrollMachine = setup({
  types: {} as {
    events: ScrollEvent
    context: ScrollContext
  },
  actions: {
    syncScroll: (_, { pos }: { pos: Box }) => syncScroll(pos),
    startStep: sendTo(
      ({ system }) => system.get('step1'),
      (_, { P, Q }: { P: Box; Q: Box }) => ({ type: 'STEP.START', P, Q })
    ),
    stopStep: sendTo(
      ({ system }) => system.get('step1'),
      () => ({ type: 'STEP.STOP' })
    ),
    notifySlideDone: sendTo(
      ({ system }) => system.get('system-pointer1'),
      () => ({ type: 'SCROLL.SLIDE.DONE' })
    ),
    notifyGetDone: sendTo(
      ({ system }) => system.get('system-pointer1'),
      () => ({
        type: 'SCROLL.GET.DONE',
        scroll: getScroll(),
      })
    ),
    notifySyncSyncDone: sendTo(
      ({ system }) => system.get('system-pointer1'),
      () => ({
        type: 'SCROLL.SYNCSYNC.DONE',
        scroll: getScroll(),
      })
    ),
  },
  actors: {
    step: stepMachine,
  },
}).createMachine({
  id: 'scroll',
  initial: 'Idle',
  context: { dest: null },
  invoke: [
    {
      src: 'step',
      systemId: 'step1',
      input: ({ self }) => ({
        parent: self,
        cb: (b: Box) => syncScroll(b),
      }),
    },
  ],
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
        SLIDE: {
          actions: [
            {
              type: 'startStep',
              params: ({ event: { P, Q } }) => ({ P, Q }),
            },
          ],
          target: 'Busy',
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
    Busy: {
      on: {
        SLIDE: {
          actions: {
            type: 'startStep',
            params: ({ event: { P, Q } }) => ({ P, Q }),
          },
        },
        'STEP.DONE': {
          actions: 'notifySlideDone',
          target: 'Idle',
        },
        CANCEL: {
          actions: [
            {
              type: 'syncScroll',
              params: ({ event }) => ({
                pos: event.pos,
              }),
            },
            'stopStep',
          ],
          target: 'Idle',
        },
      },
    },
    Syncing: {
      invoke: [
        {
          src: syncScrollLogic,
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

export type ScrollActorRef = ActorRefFrom<typeof scrollMachine>

import { ActorRefFrom, sendTo, setup } from 'xstate'
import { BoxBox as Box } from './box/prefixed'
import { getScroll, syncScroll } from './scroll'
import { stepMachine } from './step-xstate'

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

export type ScrollEvent =
  | ScrollEventSync
  | ScrollEventSlide
  | ScrollEventCancel
  | ScrollEventStepDone

export const scrollMachine = setup({
  types: {} as {
    events: ScrollEvent
  },
  actions: {
    syncScroll: (_, { pos }: { pos: Box }): boolean => syncScroll(pos),
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
  },
  actors: {
    step: stepMachine,
  },
}).createMachine({
  id: 'scroll',
  initial: 'Idle',
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
  },
})

export type ScrollActorRef = ActorRefFrom<typeof scrollMachine>

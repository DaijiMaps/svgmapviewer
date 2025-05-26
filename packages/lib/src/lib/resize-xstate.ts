import { assign, createActor, emit, raise, setup } from 'xstate'
import { type BoxBox as Box, boxEq, boxUnit } from './box/prefixed'
import { configActor } from './config-xstate'
import { type Layout, resizeLayout } from './layout'
import { getBodySize } from './utils'

type ResizeEvent = { type: 'RESIZE' } | { type: 'EXPIRED' }
type ResizeContext = {
  prev: Box
  next: Box
  waited: number
  first: boolean
}
type ResizeEmitted = { type: 'LAYOUT'; layout: Layout; force: boolean }

const resizeMachine = setup({
  types: {
    context: {} as ResizeContext,
    events: {} as ResizeEvent,
    emitted: {} as ResizeEmitted,
  },
}).createMachine({
  id: 'resize1',
  context: { prev: boxUnit, next: boxUnit, waited: 0, first: true },
  initial: 'Uninited',
  states: {
    Uninited: {
      always: {
        //actions: () => console.log('RESIZE first!'),
        target: 'Waiting',
      },
    },
    Idle: {
      on: {
        // RESIZE
        // - save size
        // - compare
        // - if different, call cb
        RESIZE: {
          //actions: () => console.log('RESIZE'),
          target: 'Busy',
        },
      },
    },
    Busy: {
      // XXX wait until window is stabilized
      // XXX and getBodySize() returns valid values
      after: {
        500: {
          actions: [
            assign({
              next: () => getBodySize(),
            }),
            raise({ type: 'EXPIRED' }),
          ],
        },
      },
      on: {
        EXPIRED: [
          {
            guard: ({ context }) => context.waited > 10000,
            target: 'Aborting',
          },
          {
            guard: ({ context }) => !boxEq(context.prev, context.next),
            actions: [
              assign({
                prev: ({ context }) => context.prev,
                waited: 0,
              }),
              emit(({ context }) => ({
                type: 'LAYOUT',
                layout: resizeLayout(context.next),
                force: !context.first,
              })),
              assign({
                first: false,
              }),
            ],
            target: 'Idle',
          },
          {
            target: 'Waiting',
          },
        ],
      },
    },
    Waiting: {
      always: {
        actions: [
          assign({
            waited: ({ context }) => context.waited + 500,
          }),
        ],
        target: 'Busy',
      },
    },
    Aborting: {
      // XXX
      // XXX
      // XXX
      // XXX
      // XXX
    },
  },
})

////

export const resizeActor = createActor(resizeMachine)
resizeActor.on('LAYOUT', ({ layout, force }) =>
  configActor.send({ type: 'CONFIG.RESIZE', layout, force })
)
resizeActor.start()

window.addEventListener('resize', () => {
  resizeActor.send({ type: 'RESIZE' })
})

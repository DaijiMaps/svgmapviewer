import { assign, createActor, emit, raise, setup } from 'xstate'
import { boxEq, boxUnit } from '../box/prefixed'
import { svgMapViewerConfig } from '../config'
import { notifyResize } from '../config-xstate'
import { getBodySize } from '../utils'
import { resizeLayout } from './layout'
import type { ResizeContext, ResizeEmitted, ResizeEvent } from './resize-types'

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
          // ignore height-only resize
          // (e.g. mobile browser address bar hiding/showing)
          {
            guard: ({ context: { prev, next } }) =>
              // width doesn't change
              prev.width === next.width &&
              // height change ratio < 0.2
              Math.abs(1 - next.height / prev.height) < 0.2,
            actions: () => console.log('resize: ignoring height-only change'),
            target: 'Idle',
          },
          {
            guard: ({ context }) => !boxEq(context.prev, context.next),
            actions: [
              assign({
                prev: ({ context }) => context.next,
                waited: 0,
              }),
              emit(({ context }) => ({
                type: 'LAYOUT',
                layout: resizeLayout(
                  svgMapViewerConfig.origViewBox,
                  svgMapViewerConfig.fontSize,
                  context.next
                ),
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

const resizeActor = createActor(resizeMachine)

resizeActor.on('LAYOUT', ({ layout, force }) => notifyResize(layout, force))
resizeActor.start()

window.addEventListener('resize', () => {
  resizeActor.send({ type: 'RESIZE' })
})

export function resizeActorStart(): void {
  resizeActor.start()
}

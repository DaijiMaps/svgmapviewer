import { assign, createActor, emit, raise, setup } from 'xstate'

import { svgMapViewerConfig } from '../../../config'
import { boxEq, boxUnit } from '../../box/prefixed'
import { notifyStyle } from '../../event-style'
import { currentLayout } from '../../style/style-xstate'
import { getBodySize } from '../../utils'
import { resizeLayout } from './layout'
import {
  type ResizeContext,
  type ResizeEmitted,
  type ResizeEvent,
} from './resize-types'

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
          target: 'Syncing',
        },
      },
    },
    Syncing: {
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
            actions: ({ context }) =>
              console.log('resize: ignoring height-only change', context),
            target: 'Idle',
          },
          {
            guard: ({ context }) => !boxEq(context.prev, context.next),
            actions: [
              assign({
                waited: 0,
              }),
              emit(({ context }) => ({
                type: 'LAYOUT',
                layout: resizeLayout(
                  svgMapViewerConfig.fontSize,
                  context.next,
                  svgMapViewerConfig.origViewBox,
                  svgMapViewerConfig.origBoundingBox
                ),
                force: !context.first,
              })),
              assign({
                first: false,
              }),
            ],
            target: 'Checking',
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
        target: 'Syncing',
      },
    },
    Checking: {
      after: {
        1000: {
          actions: raise({ type: 'EXPIRED' }),
        },
      },
      on: {
        EXPIRED: [
          {
            guard: ({ context: { next } }) => {
              const current = currentLayout.get().container
              return boxEq(next, current)
            },
            // OK
            actions: assign({
              prev: ({ context: { next } }) => next,
            }),
            target: 'Idle',
          },
          {
            target: 'Syncing',
          },
        ],
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

export function resizeActorStart(): void {
  resizeActor.start()
}

resizeActor.on('LAYOUT', (resize) => notifyStyle.resize(resize))

// XXX
window.addEventListener('resize', () => {
  resizeActor.send({ type: 'RESIZE' })
})

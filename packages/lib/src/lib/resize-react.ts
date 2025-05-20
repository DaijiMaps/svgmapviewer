import { useCallback, useEffect, useRef, useState } from 'react'
import { assign, createActor, emit, raise, setup } from 'xstate'
import { BoxBox as Box, boxEq, boxUnit } from './box/prefixed'
import { configActor, svgMapViewerConfig } from './config'
import { configLayout, makeLayout } from './layout'

export function getBodySize(): Box {
  return {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  }
}

// XXX
// XXX
// XXX use xstate
// XXX
// XXX
export function useWindowResize(
  cb: (size: Readonly<Box>, force: boolean) => void
): void {
  const sizeRef = useRef(boxUnit)
  const [size, setSize] = useState<Box>(boxUnit)
  const [resized, setResized] = useState<boolean>(false)
  const resizingRef = useRef(false)

  useEffect(() => {
    /* always */
    if (!(resized || !resized)) {
      return
    }
    const tmp = getBodySize()
    if (!boxEq(tmp, sizeRef.current)) {
      sizeRef.current = tmp
      setSize(tmp)
      cb(tmp, resizingRef.current)
      resizingRef.current = false
    }
  }, [cb, resized, size])

  const handler = useCallback(() => {
    // XXX
    // XXX
    // XXX
    requestAnimationFrame(() => {
      setResized(!resized)
      resizingRef.current = true
    })
    // XXX
    // XXX
    // XXX
  }, [resized, setResized])

  useEffect(() => {
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [handler])
}

////

type ResizeEvent = { type: 'RESIZE' } | { type: 'EXPIRED' }
type ResizeContext = {
  prev: Box
  next: Box
  waited: number
  first: boolean
}
type ResizeEmitted = { type: 'RESIZE'; size: Box; first: boolean }

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
                type: 'RESIZE',
                size: context.next,
                first: context.first,
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

export const resizeActor = createActor(resizeMachine, {
  //inspect: (iev) => console.log(iev),
})
resizeActor.on('RESIZE', (ev) => {
  configActor.getSnapshot().context.layoutCbs.forEach((cb) => {
    const { fontSize } = getComputedStyle(document.body)
    const layout = makeLayout(
      configLayout(
        parseFloat(fontSize),
        svgMapViewerConfig.origViewBox,
        ev.size
      )
    )
    cb(layout, !ev.first)
  })
})
resizeActor.start()
window.addEventListener('resize', () => {
  resizeActor.send({ type: 'RESIZE' })
})

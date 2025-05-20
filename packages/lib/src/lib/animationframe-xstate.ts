import { fromCallback, raise, sendTo, setup } from 'xstate'

// - receives START/STOP
// - sends TICK
export const animationFrameLogic = fromCallback(({ sendBack, receive }) => {
  const x: {
    active: boolean
    id: null | number
  } = {
    active: false,
    id: null,
  }
  const tick = () => {
    if (x.active) {
      sendBack({ type: 'TICK' })
      x.id = requestAnimationFrame(tick)
    }
  }
  const start = () => {
    x.active = true
    if (x.id !== null) {
      cancelAnimationFrame(x.id)
    }
    x.id = requestAnimationFrame(tick)
  }
  const stop = () => {
    x.active = false
    if (x.id !== null) {
      cancelAnimationFrame(x.id)
      x.id = null
    }
  }
  receive((event) => {
    switch (event.type) {
      case 'START':
        start()
        break
      case 'STOP':
        stop()
        break
    }
  })
  return () => stop()
})

////

type AnimationFrameEvent =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'TICK' }
type AnimationFrameEmitted = { type: 'TICK' }
interface AnimationFrameContext {
  id: null | number
}

export const animationFrameMachine = setup({
  types: {
    events: {} as AnimationFrameEvent,
    emitted: {} as AnimationFrameEmitted,
    context: {} as AnimationFrameContext,
  },
}).createMachine({
  id: 'animationframe2',
  initial: 'Idle',
  context: {
    id: null,
  },
  states: {
    Idle: {
      on: {
        START: {
          /*
          actions: enqueueActions(({ enqueue }) => {
            const id = requestAnimationFrame(() =>
              enqueue(raise({ type: 'TICK' }))
            )
            enqueue.assign({
              id: id,
            })
          }),
          */
          target: 'Busy',
        },
      },
    },
    Busy: {
      after: {
        20: {
          actions: raise({ type: 'TICK' }),
        },
      },
      on: {
        TICK: {
          /*
          actions: enqueueActions(({ enqueue }) => {
            enqueue.emit({ type: 'TICK' })
            const id = requestAnimationFrame(() =>
              enqueue(raise({ type: 'TICK' }))
            )
            enqueue.assign({
              id: id,
            })
          }),
          */
          actions: sendTo(
            ({ system }) => system.get('step1'),
            () => ({ type: 'TICK' })
          ),
          target: 'Ticked',
        },
        STOP: {
          /*
          actions: enqueueActions(({ context, enqueue }) => {
            const id = context.id
            if (id !== null) {
              enqueue(() => cancelAnimationFrame(id))
            }
            enqueue.assign({ id: null })
          }),
          target: 'Idle',
          */
          target: 'Idle',
        },
      },
    },
    Ticked: {
      // re-enter & trigger 20ms `after'
      always: 'Busy',
    },
  },
})

/*
export const animationFrameActor = createActor(animationFrameMachine, {
  systemId: 'system-animationframe2',
  inspect: (iev) => console.log(iev),
})
animationFrameActor.start()
*/

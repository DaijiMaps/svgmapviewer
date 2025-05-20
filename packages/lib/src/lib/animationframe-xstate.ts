import { fromCallback } from 'xstate'

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
  function tick() {
    if (x.active) {
      sendBack({ type: 'TICK' })
      x.id = requestAnimationFrame(tick)
    }
  }
  function start() {
    x.active = true
    x.id = requestAnimationFrame(tick)
  }
  function stop() {
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

/*
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
          target: 'Busy',
        },
      },
    },
    Busy: {
      after: {
        15: {
          actions: raise({ type: 'TICK' }),
        },
      },
      on: {
        TICK: {
          actions: sendTo(
            ({ system }) => system.get('step1'),
            () => ({ type: 'TICK' })
          ),
          target: 'Ticked',
        },
        STOP: {
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
*/

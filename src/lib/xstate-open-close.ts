import { assign, setup } from 'xstate'
import {
  OpenClose,
  openCloseClose,
  openCloseClosed,
  openCloseOpen,
  openCloseOpened,
  openCloseReset,
} from './open-close'

export interface OpenCloseInput {
  open: boolean
}

export interface OpenCloseContext {
  x: OpenClose
}

export type OpenCloseEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HANDLE' }

export const openCloseMachine = setup({
  types: {} as {
    input: OpenCloseInput
    context: OpenCloseContext
  },
  actions: {
    open: assign({
      x: ({ context }) => {
        const x = openCloseOpen(context.x)
        return x === null ? context.x : x
      },
    }),
    close: ({ context }) => {
      const x = openCloseClose(context.x)
      return x === null ? context.x : x
    },
    handle: ({ context }) => {
      const op = context.x.open ? openCloseOpened : openCloseClosed
      const x = op(context.x)
      return x === null ? context.x : x
    },
  },
}).createMachine({
  id: 'openClose',
  context: ({ input }) => ({
    x: openCloseReset(input.open),
  }),
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        OPEN: { actions: 'open', target: 'Opening' },
      },
    },
    Opening: {
      on: {
        HANDLE: { actions: 'handle', target: 'Opened' },
      },
    },
    Opened: {
      on: {
        CLOSE: { actions: 'close', target: 'Closing' },
      },
    },
    Closing: {
      on: {
        HANDLE: { actions: 'handle', target: 'Closed' },
      },
    },
    Closed: {
      always: 'Idle',
    },
  },
})

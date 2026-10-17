import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store-react'
import { assign, createActor, emit, setup } from 'xstate'

import { notifyGame } from '../event-game'
import { uiCbs } from '../event-ui'

export type QuizEvent =
  { type: 'Input'; char: string } | { type: 'Delete' } | { type: 'Reset' }
export type QuizEmit = { type: 'Done' }

export type QuizContext = {
  answer: string
  pad: string
  chars: string[]
  doneAt?: string
}
export type QuizInput = {
  answer: string
  pad: string
}

const quizMachine = setup({
  types: {
    events: {} as QuizEvent,
    context: {} as QuizContext,
    input: {} as QuizInput,
    emitted: {} as QuizEmit,
  },
  actions: {
    delete: assign({
      chars: ({ context }) => context.chars.slice(0, context.chars.length - 1),
    }),
    reset: assign({
      chars: [],
    }),
    done: assign({
      doneAt: new Date().toISOString(),
    }),
  },
}).createMachine({
  context: ({ input: { answer, pad } }) => ({
    answer,
    pad,
    chars: [],
  }),
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        Input: {
          actions: assign({
            chars: ({ context, event }) =>
              context.chars.indexOf(event.char) < 0
                ? [...context.chars, event.char]
                : context.chars,
          }),
          target: 'Checking',
        },
        Delete: {
          actions: 'delete',
        },
        Reset: {
          actions: 'reset',
        },
      },
    },
    Ready: {},
    Checking: {
      always: [
        {
          guard: ({ context }) => context.chars.join('') === context.answer,
          target: 'Done',
        },
        'Idle',
      ],
    },
    Done: {
      entry: ['done', emit({ type: 'Done' })],
    },
  },
})

type S = (ev: Readonly<QuizEvent>) => void

export type Quiz = {
  send: S
  useQuiz: () => undefined | QuizContext
}

export function makeQuiz(id: number, answer: string, pad: string): Quiz {
  const atom = createAtom<undefined | QuizContext>(undefined)
  const actor = createActor(quizMachine, {
    inspect: console.log,
    input: { answer, pad },
  })
  actor.subscribe((s) => atom.set(s.context))
  actor.on('Done', () => notifyGame.answer(id))
  actor.start()
  const send = actor.send
  uiCbs.closeDone.add(() => send({ type: 'Reset' }))
  return {
    send,
    useQuiz: () => {
      return useAtom(atom)
    },
  }
}

export function quizCbsStart(): void {}

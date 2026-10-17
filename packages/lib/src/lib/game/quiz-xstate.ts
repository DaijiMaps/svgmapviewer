import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store-react'
import { assign, createActor, emit, setup } from 'xstate'

import { gameCbs, notifyGame } from '../event-game'
import { uiCbs } from '../event-ui'
import type { GameContext, Question } from './game-xstate'

export type QuizEvent =
  | { type: 'Input'; char: string }
  | { type: 'Delete' }
  | { type: 'Reset' }
  | { type: 'Skip' }
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
      doneAt: undefined,
    }),
    skip: assign({
      chars: ({ context }) => context.answer.split(''),
      doneAt: new Date().toISOString(),
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
        Skip: {
          actions: 'skip',
          target: 'Done',
        },
      },
    },
    Checking: {
      always: [
        {
          guard: ({ context }) => context.chars.join('') === context.answer,
          actions: ['done', emit({ type: 'Done' })],
          target: 'Done',
        },
        'Idle',
      ],
    },
    Done: {
      on: {
        Reset: {
          actions: 'reset',
          target: 'Idle',
        },
      },
    },
  },
})

type S = (ev: Readonly<QuizEvent>) => void

export type Quiz = {
  send: S
  useQuiz: () => undefined | QuizContext
}

function isAnswered(id: number, game?: Readonly<GameContext>): boolean {
  const qs = game?.questions ?? []
  const f = (q: Question) => q.idx === id && q.answeredAt
  return qs.filter(f).length > 0
}

export function makeQuiz(id: number, answer: string, pad: string): Quiz {
  const atom = createAtom<undefined | QuizContext>(undefined)
  const actor = createActor(quizMachine, {
    //inspect: console.log, // XXX
    input: { answer, pad },
  })

  const send = actor.send
  const reset = () => send({ type: 'Reset' })
  const skip = () => send({ type: 'Skip' })

  actor.on('Done', () => notifyGame.answer(id))
  actor.subscribe((s) => atom.set(s.context))

  gameCbs.start.add((game?: Readonly<GameContext>) => {
    if (isAnswered(id, game)) skip()
  })
  gameCbs.reset.add(reset)
  uiCbs.closeDone.add(reset)

  actor.start()

  return {
    send,
    useQuiz: () => {
      return useAtom(atom)
    },
  }
}

/*
type M = undefined | Map<number, Quiz>

export const quizzesAtom: Atom<M> = createAtom(undefined)
*/

export function quizCbsStart(): void {
  /*
  globalCbs.init.add((cfg) => {
    const qcs = cfg.gameConfig?.quizzes ?? []
    const qs = qcs.map((qc) => makeQuiz(qc.id, qc.answer, qc.pad))
    const m = new Map(qs.map((q, idx) => [idx, q] as const))
    quizzesAtom.set(() => m)
  })
  */
}

/*
export function useQuizById(id: number): undefined | Quiz {
  const m = useAtom(quizzesAtom)
  const q = m?.get(id)
  return q
}
*/

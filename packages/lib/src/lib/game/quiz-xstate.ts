import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store-react'
import { assign, createActor, emit, setup } from 'xstate'

import type { SvgMapViewerConfig } from '../../types'
import { gameCbs, notifyGame } from '../event-game'
import { uiCbs } from '../event-ui'
import type { GameContext, Question } from './game-xstate'

export type QuizEvent =
  | { type: 'Skip'; answeredAt: string }
  | { type: 'Input'; char: string }
  | { type: 'Delete' }
  | { type: 'Reset' }
  | { type: 'Init' }
export type QuizEmit = { type: 'Done' }

export type QuizContext = {
  answer: string
  pad: string
  chars: string[]
  answeredAt?: string
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
    input: assign({
      chars: ({ context }, params: { char: string }) =>
        context.chars.indexOf(params.char) < 0
          ? [...context.chars, params.char]
          : context.chars,
    }),
    delete: assign({
      chars: ({ context }) => context.chars.slice(0, context.chars.length - 1),
    }),
    reset: assign({
      chars: [],
      answeredAt: undefined,
    }),
    skip: assign({
      chars: ({ context }) => context.answer.split(''),
      answeredAt: (_, params: { answeredAt: string }) => params.answeredAt,
    }),
    done: assign({
      answeredAt: new Date().toISOString(),
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
        Skip: {
          actions: { type: 'skip', params: ({ event }) => event },
          target: 'Done',
        },
        Input: {
          actions: { type: 'input', params: ({ event }) => event },
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
        Init: {
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

function isAnswered(
  id: number,
  game?: Readonly<GameContext>
): undefined | string {
  const qs = game?.questions ?? []
  const f = (q: Question) => q.idx === id && q.answeredAt
  const xs = qs.filter(f)
  return xs.map((x) => x.answeredAt).at(0)
}

export function makeQuiz(id: number, answer: string, pad: string): Quiz {
  const atom = createAtom<undefined | QuizContext>(undefined)
  const actor = createActor(quizMachine, {
    //inspect: console.log, // XXX
    input: { answer, pad },
  })

  const send = actor.send
  const skip = (answeredAt: string) => send({ type: 'Skip', answeredAt })
  const reset = () => send({ type: 'Reset' })
  const init = () => send({ type: 'Init' })

  actor.on('Done', () => notifyGame.answer(id))
  actor.subscribe((s) => atom.set(s.context))

  gameCbs.start.add((game?: Readonly<GameContext>) => {
    const a = isAnswered(id, game)
    if (a) skip(a)
  })
  gameCbs.reset.add(init)
  uiCbs.closeDone.add(reset)

  actor.start()

  return {
    send,
    useQuiz: () => {
      return useAtom(atom)
    },
  }
}

type M = undefined | Map<number, Quiz>

const quizzesAtom = createAtom<M>(undefined)

export function quizInit(config: SvgMapViewerConfig): void {
  const qcs = config.gameConfig?.quizzes ?? []
  const qs = qcs.map((qc) => makeQuiz(qc.id, qc.answer, qc.pad))
  const m = new Map(qs.map((q, idx) => [idx, q] as const))
  quizzesAtom.set(() => m)
}

export function useQuizById(id: number): undefined | Quiz {
  const m = useAtom(quizzesAtom)
  const q = m?.get(id)
  return q
}

export function quizCbsStart(): void {}

import { createAtom, useAtom } from '@xstate/store-react'
import {
  assign,
  createActor,
  setup,
  type ActorRefFrom,
  type SnapshotFrom,
} from 'xstate'

import type { SvgMapViewerConfig } from '../../types'
import { gameCbs, notifyGame } from '../event-game'
import { globalCbs } from '../event-global'
import { makeQuiz, type Quiz } from './quiz-xstate'

const d = () => new Date().toISOString()

type GameEvent =
  | { readonly type: 'Start' }
  | { readonly type: 'Answer'; readonly question: number }
  | { readonly type: 'Receive' }
  | { readonly type: 'Reset'; readonly questions: readonly number[] }

export type Question = {
  readonly idx: number
  readonly answeredAt?: string
}
export type GameContext = {
  readonly questions: readonly Question[]
  readonly startedAt?: string
  readonly completedAt?: string
  readonly receivedAt?: string
}

type GameInput = {
  readonly questions: readonly number[]
}

const gameMachine = setup({
  types: {
    events: {} as GameEvent,
    context: {} as GameContext,
    input: {} as GameInput,
  },
  guards: {
    isAnswered: ({ context }, params: { question: number }) =>
      context.questions.filter(
        (q) => q.idx === params.question && q.answeredAt !== undefined
      ).length > 0,
    isCompleted: ({ context }) =>
      context.questions.filter((q) => q.answeredAt === undefined).length === 0,
  },
  actions: {
    answer: assign({
      questions: ({ context }, params: { question: number }) =>
        context.questions.map((q) =>
          q.idx !== params.question ? q : { ...q, answeredAt: d() }
        ),
    }),
    complete: assign({ completedAt: d() }),
    receive: assign({ receivedAt: d() }),
    reset: assign({
      questions: ({ context }) =>
        context.questions.map((q) => ({ ...q, answeredAt: undefined })),
      startedAt: undefined,
      completedAt: undefined,
      receivedAt: undefined,
    }),
  },
}).createMachine({
  context: ({ input }) => ({
    questions: input.questions.map((q) => ({ idx: q, answeredAt: undefined })),
    startedAt: undefined,
    completedAt: undefined,
    receivedAt: undefined,
  }),
  initial: 'Idle',
  states: {
    Idle: {
      entry: 'reset',
      /*
      on: {
        Start: {
          target: 'Playing',
        },
      },
      */
      always: 'Playing',
    },
    Playing: {
      on: {
        Answer: [
          {
            guard: {
              type: 'isAnswered',
              params: ({ event }) => ({ question: event.question }),
            },
          },
          {
            actions: { type: 'answer', params: ({ event }) => event },
            target: 'Checking',
          },
        ],
        Reset: 'Idle',
      },
    },
    Checking: {
      always: [
        {
          guard: 'isCompleted',
          target: 'Completed',
        },
        'Playing',
      ],
    },
    Completed: {
      entry: 'complete',
      on: {
        Receive: 'Received',
        Reset: 'Idle',
      },
    },
    Received: {
      entry: 'receive',
      on: {
        Reset: 'Idle',
      },
    },
  },
})

type A = ActorRefFrom<typeof gameMachine>
type S = SnapshotFrom<typeof gameMachine>

function loadState(key: string): undefined | S {
  const stateString = localStorage.getItem(key)
  return stateString ? JSON.parse(stateString) : undefined
}
function saveState(key: string, actor: A): void {
  const persistedState = actor.getPersistedSnapshot()
  localStorage.setItem(key, JSON.stringify(persistedState))
}

type Game2 = {
  game: undefined | GameContext
  useQuizById: (id: number) => undefined | Quiz
}

type M = undefined | Map<number, Quiz>

// XXX having a copy only for useGame2()
const contextAtom = createAtom<undefined | GameContext>(undefined)
//const gameAtom = createAtom<undefined | Game2>(undefined)
const quizzesAtom = createAtom<undefined | M>(undefined)

/*
export function useGameContext(): undefined | GameContext {
  return useAtom(contextAtom)
}
*/
export function useGame2(): Game2 {
  const game = useAtom(contextAtom)
  const game2: Game2 = {
    game,
    useQuizById: (id: number) => {
      const qs = useAtom(quizzesAtom)
      return qs?.get(id)
    },
  }
  return game2
}

function gameInit(config: SvgMapViewerConfig): void {
  const qcs = config.gameConfig?.quizzes ?? []
  const qs = qcs.map((qc) => makeQuiz(qc.id, qc.answer, qc.pad))
  const m = new Map(qs.map((q, idx) => [idx, q] as const))
  quizzesAtom.set(() => m)

  // XXX prefix map name
  const key = 'svgmapviewer-game-state'

  const questions = config.gameConfig?.questions ?? []
  const snapshot = loadState(key)

  // input is used when snapshot is undefined
  const gameActor = createActor(gameMachine, {
    //inspect: console.log, // XXX
    snapshot,
    input: {
      questions,
    },
  })

  gameActor.subscribe((s) => {
    saveState(key, gameActor)
    contextAtom.set(s.context)
  })

  globalCbs.init.add(() => notifyGame.start(snapshot?.context))
  gameCbs.answer.add((question: number) =>
    gameActor.send({ type: 'Answer', question })
  )
  gameCbs.receive.add(() => gameActor.send({ type: 'Receive' }))
  gameCbs.reset.add(() => gameActor.send({ type: 'Reset', questions }))

  gameActor.start()
}

export function gameCbStart(): void {
  globalCbs.init.add(gameInit)
}

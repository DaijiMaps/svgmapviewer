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
import { quizInit } from './quiz-xstate'

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
    isCompleted: ({ context }) => {
      const uqs = context.questions.filter((q) => q.answeredAt === undefined)
      return uqs.length === 0
    },
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
      questions: ({ context }) => context.questions.map((q) => ({ ...q })),
    }),
  },
}).createMachine({
  context: ({ input }) => ({
    questions: input.questions.map((q) => ({ idx: q })),
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

//type M = undefined | Map<number, Quiz>

// XXX having a copy only for useGame2()
const gameAtom = createAtom<undefined | GameContext>(undefined)

export function useGame(): undefined | GameContext {
  return useAtom(gameAtom)
}

function gameInit(config: SvgMapViewerConfig): void {
  // init quiz before snapshot is restored
  quizInit(config)

  const key = `svgmapviewer:${config.title}:game-state`

  const questions = (config.gameConfig?.quizzes ?? []).map((z) => z.id)
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
    gameAtom.set(s.context)
  })

  gameCbs.answer.add((question: number) =>
    gameActor.send({ type: 'Answer', question })
  )
  gameCbs.receive.add(() => gameActor.send({ type: 'Receive' }))
  gameCbs.reset.add(() => gameActor.send({ type: 'Reset', questions }))

  gameActor.start()

  // restore quizzes
  notifyGame.start(snapshot?.context)
}

export function gameCbStart(): void {
  globalCbs.init.add(gameInit)
}

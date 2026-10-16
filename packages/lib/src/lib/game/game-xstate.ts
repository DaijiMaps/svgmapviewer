import { createAtom, useAtom } from '@xstate/store-react'
import {
  assign,
  createActor,
  setup,
  type ActorRefFrom,
  type SnapshotFrom,
} from 'xstate'

import type { SvgMapViewerConfig } from '../../types'
import { gameCbs } from '../event-game'
import { globalCbs } from '../event-global'

const d = () => new Date().toISOString()

type GameEvent =
  | { type: 'Init' }
  | { type: 'Answer'; question: number }
  | { type: 'Receive' }
  | { type: 'Reset'; questions: number[] }

type Question = {
  idx: number
  answeredAt?: string
}
type GameContext = {
  questions: Question[]
  startedAt?: string
  completedAt?: string
  receivedAt?: string
}

type GameInput = {
  questions: number[]
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
      on: {
        Init: {
          target: 'Playing',
        },
      },
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
            target: 'Completed',
          },
        ],
      },
    },
    'Playing.Checking': {
      always: [
        { guard: 'isCompleted', target: 'Completed' },
        { target: 'Playing' },
      ],
    },
    Completed: {
      on: {
        Receive: {
          actions: 'receive',
          target: 'Received',
        },
      },
    },
    Received: {
      on: {
        Reset: {
          actions: 'reset',
          target: 'Idle',
        },
      },
    },
  },
})

type A = ActorRefFrom<typeof gameMachine>
type S = SnapshotFrom<typeof gameMachine>

// XXX localStorage
function loadState(key: string): undefined | S {
  const stateString = localStorage.getItem(key)
  return stateString ? JSON.parse(stateString) : undefined
}
function saveState(key: string, actor: A): void {
  const persistedState = actor.getPersistedSnapshot()
  localStorage.setItem(key, JSON.stringify(persistedState))
}

// XXX having a copy only for useGameContext()
const contextAtom = createAtom<undefined | GameContext>(undefined)

export function useGameContext(): undefined | GameContext {
  return useAtom(contextAtom)
}

function gameInit(config: SvgMapViewerConfig): void {
  // XXX prefix map name
  const key = 'svgmapviewer-game-state'

  const questions = config.gameConfig?.questions ?? []
  const snapshot = loadState(key)

  // input is used when snapshot is undefined
  const gameActor = createActor(gameMachine, {
    snapshot,
    input: {
      questions,
    },
  })

  gameActor.subscribe((s) => {
    saveState(key, gameActor)
    contextAtom.set(s.context)
  })
  gameActor.start()

  gameCbs.start.add(() => gameActor.send({ type: 'Init' }))
  gameCbs.answer.add((question: number) =>
    gameActor.send({ type: 'Answer', question })
  )
  gameCbs.receive.add(() => gameActor.send({ type: 'Receive' }))
  gameCbs.reset.add(() => gameActor.send({ type: 'Reset', questions }))
}

export function gameCbStart(): void {
  globalCbs.init.add(gameInit)
}

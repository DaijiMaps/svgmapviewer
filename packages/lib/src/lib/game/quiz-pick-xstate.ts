import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store-react'
import { assign, createActor, emit, setup } from 'xstate'

import type { SvgMapViewerConfig } from '../../types'
import { gameCbs, notifyGame } from '../event-game'
import { uiCbs } from '../event-ui'
import type { GameContext, Question } from './game-xstate'

type Answered = { answered: string; answeredAt: string }

export type PickEvent =
  | ({ type: 'Skip' } & Answered)
  | { type: 'Select'; char: string }
  | { type: 'Reset' }
  | { type: 'Init' }
export type PickEmit = {
  type: 'Answered'
  answered?: string
  answeredAt: string
}

export type PickContext = {
  chars: string[]
  answered?: string
  answeredAt?: string
}
export type PickInput = {
  answer: string
  pad: string
}

const pickMachine = setup({
  types: {
    events: {} as PickEvent,
    context: {} as PickContext,
    input: {} as PickInput,
    emitted: {} as PickEmit,
  },
  actions: {
    select: assign({
      answered: (_, params: { char: string }) => params.char,
    }),
    delete: assign({
      chars: ({ context }) => context.chars.slice(0, context.chars.length - 1),
    }),
    reset: assign({
      chars: [],
      answeredAt: undefined,
    }),
    skip: assign({
      answered: (_, params: { answered: string; answeredAt: string }) =>
        params.answered,
      answeredAt: (_, params: { answered: string; answeredAt: string }) =>
        params.answeredAt,
    }),
    done: assign({
      answeredAt: new Date().toISOString(),
    }),
    answered: ({ context: { answered, answeredAt } }) =>
      emit({ type: 'Answered', answered, answeredAt }),
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
        Select: {
          actions: [
            { type: 'select', params: ({ event }) => event },
            'done',
            { type: 'answered' },
          ],
        },
        Delete: {
          actions: 'delete',
        },
        Reset: {
          actions: 'reset',
        },
      },
    },
  },
})

type S = (ev: Readonly<PickEvent>) => void

export type Pick = {
  send: S
  usePickContext: () => undefined | PickContext
}

function isAnswered(
  id: number,
  game?: Readonly<GameContext>
): undefined | Answered {
  const qs = game?.questions ?? []
  const f = (q: Question) => q.idx === id && q.answered && q.answeredAt
  const xs = qs.filter(f)
  const x = xs.at(0)
  return x?.answered && x?.answeredAt
    ? { answered: x.answered, answeredAt: x.answeredAt }
    : undefined
}

export function makePick(id: number, answer: string, pad: string): Pick {
  const atom = createAtom<undefined | PickContext>(undefined)
  const actor = createActor(pickMachine, {
    //inspect: console.log, // XXX
    input: { answer, pad },
  })

  const send = actor.send
  const skip = (answered: Answered) => send({ type: 'Skip', ...answered })
  const reset = () => send({ type: 'Reset' })
  const init = () => send({ type: 'Init' })

  actor.on('Answered', () => notifyGame.answer(id))
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
    usePickContext: () => {
      return useAtom(atom)
    },
  }
}

type M = undefined | Map<number, Pick>

const pickzesAtom = createAtom<M>(undefined)

export function pickInit(config: SvgMapViewerConfig): void {
  const qcs = config.gameConfig?.quizzes ?? []
  const qs = qcs
    .filter((qc) => qc.type === 'Sort')
    .map((qc) => makePick(qc.id, qc.answer, qc.pad))
  const m = new Map(qs.map((q, idx) => [idx, q] as const))
  pickzesAtom.set(() => m)
}

export function usePick(id: number): undefined | Pick {
  const m = useAtom(pickzesAtom)
  const q = m?.get(id)
  return q
}

export function pickCbsStart(): void {}

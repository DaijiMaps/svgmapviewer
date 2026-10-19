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
  answeredAt?: string
}

export type PickContext = {
  chars: string[]
  answered?: string
  answeredAt?: string
}
export type PickInput = {
  chars: string[]
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
      answeredAt: () => new Date().toISOString(),
    }),
    unselect: assign({
      answered: undefined,
      answeredAt: undefined,
    }),
    delete: assign({
      chars: ({ context }) => context.chars.slice(0, context.chars.length - 1),
    }),
    reset: assign({
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
    answered: emit(({ context: { answered, answeredAt } }) => ({
      type: 'Answered',
      answered,
      answeredAt,
    })),
  },
}).createMachine({
  context: ({ input: { chars } }) => ({
    chars,
  }),
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        Skip: {
          actions: { type: 'skip', params: ({ event }) => event },
        },
        Select: [
          {
            guard: ({ context, event }) => context.answered !== event.char,
            actions: [
              { type: 'select', params: ({ event }) => event },
              'done',
              'answered',
            ],
          },
          {
            actions: ['unselect', 'done', 'answered'],
          },
        ],
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
  readonly id: number
  readonly send: S
  readonly usePickContext: () => undefined | PickContext
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

// XXX
// XXX
// XXX
// XXX make this makePickMap
export function makePick(id: number, chars: string[]): Pick {
  const atom = createAtom<undefined | PickContext>(undefined)
  const actor = createActor(pickMachine, {
    //inspect: console.log, // XXX
    input: { chars },
  })

  const send = actor.send
  const skip = (answered: Answered) => send({ type: 'Skip', ...answered })
  const reset = () => send({ type: 'Reset' })
  const init = () => send({ type: 'Init' })

  actor.on('Answered', (q) =>
    notifyGame.answer({
      idx: id,
      answered: q.answered,
      answeredAt: q.answeredAt,
      force: true,
    })
  )
  actor.subscribe((s) => atom.set(s.context))

  gameCbs.start.add((game?: Readonly<GameContext>) => {
    const a = isAnswered(id, game)
    if (a) skip(a)
  })
  gameCbs.reset.add(init)
  uiCbs.closeDone.add(reset)

  actor.start()

  return {
    id,
    send,
    usePickContext: () => {
      return useAtom(atom)
    },
  }
}

type M = undefined | Map<number, Pick>

const pickMapAtom = createAtom<M>(undefined)

// XXX
// XXX
// XXX
// XXX pickMapInit
// XXX have a single usePickContext
// XXX look up by id and return the corresponding context
export function pickInit(config: SvgMapViewerConfig): void {
  const qcs = config.gameConfig?.quizzes ?? []
  const qs = qcs
    .filter((qc) => qc.type === 'Pick')
    .map((qc) => [qc.id, makePick(qc.id, qc.chars)] as const)
  const m = new Map(qs.map(([id, q]) => [id, q] as const))
  pickMapAtom.set(() => m)
}
// XXX
// XXX
// XXX

export function usePick(id: number): undefined | Pick {
  const m = useAtom(pickMapAtom)
  const q = m?.get(id)
  return q
}

export function pickCbsStart(): void {}

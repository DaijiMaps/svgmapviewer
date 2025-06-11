/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { assign, createActor, emit, setup } from 'xstate'
import { getCurrentScroll, scrollEventCbs } from './lib/scroll'
import { styleSend } from './lib/style-xstate'
import { Measure, MeasureCoordinate } from './Measure'

export function Guides(): ReactNode {
  return (
    <div className="guides">
      <svg className="guides">
        <Measure />
      </svg>
      <MeasureCoordinate />
    </div>
  )
}

type EV = { timeStamp: number }

type Events = { type: 'TICK'; ev: EV }
type Emitted = { type: 'CALL' }
type Context = { ticked: boolean }

const expireMachine = setup({
  types: {
    events: {} as Events,
    emitted: {} as Emitted,
    context: {} as Context,
  },
  actions: {
    clear: assign({ ticked: false }),
    set: assign({ ticked: true }),
    call: emit({ type: 'CALL' }),
  },
  delays: {
    DURATION: 500,
  },
}).createMachine({
  id: 'expire1',
  context: { ticked: false },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        TICK: { target: 'Empty' },
      },
    },
    Empty: {
      after: { DURATION: { actions: ['call', 'clear'], target: 'Idle' } },
      on: {
        TICK: {
          guard: ({ context }) => !context.ticked,
          actions: { type: 'set', params: ({ event }) => event },
          target: 'Active',
        },
      },
    },
    Active: {
      after: { DURATION: { target: 'Expired' } },
      on: {
        TICK: {
          actions: { type: 'set', params: ({ event }) => event },
          target: 'Restarting',
        },
      },
    },
    Restarting: { always: 'Active' },
    Expired: {
      always: { actions: ['call', 'clear'], target: 'Idle' },
    },
  },
})

const expireActor = createActor(expireMachine, {
  //inspect: (iev) => console.log(iev),
})

export function expireActorStart(): void {
  expireActor.start()
}

expireActor.on('CALL', () => {
  const { scroll, client } = getCurrentScroll()
  const p = {
    x: scroll.x + client.width / 2,
    y: scroll.y + client.height / 2,
  }
  styleSend({ type: 'STYLE.LONLAT', p })
})

scrollEventCbs.add(function (ev: Readonly<EV>): void {
  expireActor.send({ type: 'TICK', ev })
})

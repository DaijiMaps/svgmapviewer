import { useSelector } from '@xstate/react'
import { assign, createActor, emit, setup } from 'xstate'

import { getGame, type GameContext } from './lib/game/game-xstate'

// XXX broadcast channel
const channel = new BroadcastChannel('svgmapviewer-game')
const channelRcv = new BroadcastChannel('svgmapviewer-game-rcv')
window.addEventListener('pagehide', () => channel.close())
window.addEventListener('pagehide', () => channelRcv.close())

////

type ModeGameEvent =
  { type: 'Reload' } | { type: 'Sync.Done'; game: undefined | GameContext }
type ModeGameEmit = { type: 'Sync' }

type ModeGameContext = {
  game?: GameContext
}

const gameMachine = setup({
  types: {
    context: {} as ModeGameContext,
    events: {} as ModeGameEvent,
    emitted: {} as ModeGameEmit,
  },
}).createMachine({
  initial: 'Idle',
  context: {},
  states: {
    Idle: {
      entry: emit({ type: 'Sync' }),
      on: {
        Reload: {
          actions: emit({ type: 'Sync' }),
        },
        'Sync.Done': {
          actions: assign({
            game: ({ event }) => event.game,
          }),
        },
      },
    },
  },
})

const actor = createActor(gameMachine)
actor.on('Sync', (ev) => channel.postMessage(ev))
actor.start()
const send = actor.send

export type ModeGame = {
  game?: GameContext
  send: (event: ModeGameEvent) => void
}

export function useModeGame(): ModeGame {
  const game = useSelector(actor, (s) => s.context.game)
  return {
    game,
    send,
  }
}

if (window.name === 'game') {
  console.log('game window')

  channelRcv.onmessage = (ev: MessageEvent<ModeGameEvent>) => {
    console.log('Rcv', ev)
    send(ev.data)
  }

  window.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      send({ type: 'Reload' })
    }
  })
}

////

console.log('window:', window.name)
if (!window.name || window.name === 'main') {
  channel.onmessage = (ev: MessageEvent<ModeGameEmit>) => {
    if (ev.data.type === 'Sync') {
      console.log('Sync!')
      const game = getGame()
      channelRcv.postMessage({ type: 'Sync.Done', game })
    }
  }
}

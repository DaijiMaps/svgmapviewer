import { type ReactNode } from 'react'
import { createActor, emit, setup } from 'xstate'
import { Ui } from '../Ui'

type RootEvent = { type: 'MOUNT' }
type RootEmit = { type: 'RENDER' }

const uiRootLogic = setup({
  types: {
    events: {} as RootEvent,
    emitted: {} as RootEmit,
  },
}).createMachine({
  id: 'ui-root',
  on: {
    MOUNT: {
      actions: emit({ type: 'RENDER' }),
    },
  },
})

////

export type RenderCb = (children: ReactNode) => void

export const uiRootRenderCbs: Set<RenderCb> = new Set<RenderCb>()

const uiRootActor = createActor(uiRootLogic)

uiRootActor.on('RENDER', () => uiRootRenderCbs.forEach((cb) => cb(Ui())))

uiRootActor.start()

export function uiRootActorStart(): void {
  uiRootActor.start()
}

export function uiRootSend(ev: RootEvent): void {
  uiRootActor.send(ev)
}

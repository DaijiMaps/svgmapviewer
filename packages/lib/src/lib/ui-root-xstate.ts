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

export const uiRootRenderCbs = new Set<RenderCb>()

export const uiRootActor = createActor(uiRootLogic)

uiRootActor.on('RENDER', () => uiRootRenderCbs.forEach((cb) => cb(Ui())))

uiRootActor.start()

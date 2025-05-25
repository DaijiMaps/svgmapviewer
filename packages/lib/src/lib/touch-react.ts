import { createActor } from 'xstate'
import { pointerActor } from './pointer-react'
import { touchMachine } from './touch-xstate'

export const touchActor = createActor(touchMachine)

touchActor.on('MULTI.START', () => pointerActor.send({ type: 'TOUCH.LOCK' }))
touchActor.on('MULTI.END', () => pointerActor.send({ type: 'TOUCH.UNLOCK' }))
touchActor.on('ZOOM', ({ z }) => {
  pointerActor.send({ type: 'ZOOM.ZOOM', z: z > 0 ? 1 : -1 })
})

touchActor.start()

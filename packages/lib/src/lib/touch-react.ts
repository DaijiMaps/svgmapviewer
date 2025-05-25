import { createActor } from 'xstate'
import { pointerActor } from './pointer-react'
import { touchMachine } from './touch-xstate'

export let touching = false

////

export const touchActor = createActor(touchMachine)

touchActor.on('MULTI.START', () => {
  touching = true
  pointerActor.send({ type: 'TOUCH.LOCK' })
})

touchActor.on('MULTI.END', () => {
  pointerActor.send({ type: 'TOUCH.UNLOCK' })
  touching = false
})
touchActor.on('ZOOM', ({ z, p }) => {
  pointerActor.send({ type: 'ZOOM.ZOOM', z: z > 0 ? 1 : -1, p })
})

touchActor.start()

////

export function touchSendTouchStart(ev: React.TouchEvent) {
  touchActor.send({ type: 'TOUCH.START', ev })
}
export function touchSendTouchMove(ev: React.TouchEvent) {
  touchActor.send({ type: 'TOUCH.MOVE', ev })
}
export function touchSendTouchEnd(ev: React.TouchEvent) {
  touchActor.send({ type: 'TOUCH.END', ev })
}
export function touchSendCancel() {
  touchActor.send({ type: 'CANCEL' })
}

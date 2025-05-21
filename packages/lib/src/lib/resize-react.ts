import { resizeActor } from './resize-xstate'

window.addEventListener('resize', () => {
  resizeActor.send({ type: 'RESIZE' })
})

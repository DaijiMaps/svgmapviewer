import type { VecVec } from '../../vec/prefixed'
import { type Touches } from './touch'

// XXX TouchEvent is DOM
type TouchEventStart = { type: 'TOUCH.START'; ev: React.TouchEvent }
type TouchEventMove = { type: 'TOUCH.MOVE'; ev: React.TouchEvent }
type TouchEventEnd = { type: 'TOUCH.END'; ev: React.TouchEvent }

type TouchEvent_ =
  | { type: 'CANCEL' }
  | TouchEventStart
  | TouchEventMove
  | TouchEventEnd
  | { type: 'STARTED' } // internal
  | { type: 'MOVED' } // internal
  | { type: 'ENDED' } // internal
  | { type: 'NONE' } // internal
  | { type: 'SCROLL' }
type TouchEmit_ =
  | {
      type: 'MULTI'
      touches: Touches
      center: null | VecVec
      scale: null | number
    }
  | { type: 'ZOOM'; touches: Touches }
  | {
      type: 'ZOOM.SYNC'
      touches: Touches
      center: null | VecVec
      end?: boolean
    }
type TouchContext_ = {
  mode: 'idle' | 'pan' | 'pinch'
  touches: Touches
  active: boolean
  center: null | VecVec
  scale: null | number
  scrolling: boolean
}

type TouchTags_ = 'none' | 'single' | 'double' | 'many' | 'cancel'

export {
  type TouchContext_,
  type TouchEmit_,
  type TouchEvent_,
  type TouchTags_,
}

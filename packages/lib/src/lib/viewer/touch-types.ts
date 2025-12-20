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
type TouchEmit_ =
  | { type: 'MULTI'; touches: Touches }
  | { type: 'ZOOM'; touches: Touches }
type TouchContext_ = {
  touches: Touches
}

export { type TouchContext_, type TouchEmit_, type TouchEvent_ }

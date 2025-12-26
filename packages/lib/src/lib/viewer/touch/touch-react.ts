import { type Vecs } from './touch'
import { useTouchContext } from './touch-xstate'

export function useTouchesVecs(): Vecs {
  return useTouchContext().touches.vecs
}
export function useTouchesZ(): null | number {
  return useTouchContext().touches.z
}

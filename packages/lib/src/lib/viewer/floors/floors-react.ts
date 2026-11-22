import { useFloorsContext } from './floors-xstate'

export interface UseFloorsReturn {
  fidx: number
  prevFidx: null | number
}

export function useFloors(): UseFloorsReturn {
  const { fidx, prevFidx } = useFloorsContext(({ fidx, prevFidx }) => ({
    fidx,
    prevFidx,
  }))

  return {
    fidx,
    prevFidx,
  }
}

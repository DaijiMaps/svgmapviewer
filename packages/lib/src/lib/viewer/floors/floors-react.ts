import { useFloorsContext } from './floors-xstate'

export interface UseFloorsReturn {
  fidx: number
  prevFidx: null | number
  urls: Map<number, string>
}

export function useFloors(): UseFloorsReturn {
  const { fidx, prevFidx, urls } = useFloorsContext(
    ({ fidx, prevFidx, urls }) => ({
      fidx,
      prevFidx,
      urls,
    })
  )

  return {
    fidx,
    prevFidx,
    urls,
  }
}

import type { GetOp, GetOps, MapPathOps } from './types'

export function getPathsByData<L extends MapPathOps>({
  type,
  data,
}: Readonly<L>): GetOps<L> {
  return data ? data().map((vs) => ({ type, tags: [], vs }) as GetOp<L>) : []
}

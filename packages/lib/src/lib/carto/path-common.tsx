import type { ReactNode } from 'react'
import type { GetOp, GetOps, PathOps } from './path-types'
import type { MapPathOps } from './types'

export function renderPath<L extends MapPathOps>(
  xxx: Readonly<PathOps<L>>,
  {
    name: layerName,
    width: defaultStrokeWidth,
    widthScale: defaultStrokeWidthScale,
  }: Readonly<MapPathOps>,
  m: DOMMatrixReadOnly,
  { id, tags, width, widthScale, vs }: GetOp<L>
): ReactNode {
  return (
    <path
      id={id === undefined ? undefined : `path${id}`}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={xxx.toPathD(m)(vs)}
    />
  )
}

export function getPathsByData<L extends MapPathOps>({
  type,
  data,
}: Readonly<L>): GetOps<L> {
  return data ? data().map((vs) => ({ type, tags: [], vs }) as GetOp<L>) : []
}

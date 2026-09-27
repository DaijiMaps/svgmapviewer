/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { FloorsConfig, LabelsMap, LabelsTexts } from '../../../types'

const labelsMapCache = new Set<LabelsMap>()

export function getLabels(
  labelsMap: Readonly<FloorsConfig['labelsMap']> | undefined,
  k: string
): LabelsTexts | undefined {
  if (labelsMap === undefined) return undefined
  const vs = Array.from(labelsMapCache.values())
  if (vs.length === 1) return vs[0].get(k)
  const m =
    labelsMap instanceof Map
      ? labelsMap
      : new Map(
          labelsMap instanceof Array ? labelsMap : Object.entries(labelsMap)
        )
  labelsMapCache.add(m)
  return m.get(k)
}

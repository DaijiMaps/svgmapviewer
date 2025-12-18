import type { Stairs } from './stairs/types'
import type { Toilet } from './toilet/types'

export type FacilityKind = Stairs | Toilet

export interface FacilityInfo {
  tag: 'facility'
  kind: FacilityKind
}

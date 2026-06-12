import { type SearchRes } from '../../types'
import { type VecVec } from '../vec/prefixed'
import { type LayoutCoord } from '../viewer/layout/coord'
import type { BalloonProps } from './Balloon'
import { type OpenClose } from './openclose'

export type UiPart = 'header' | 'detail'

export type OpenCloseMap = Record<UiPart, OpenClose>

export type UiDetailContent = SearchRes & {
  p: VecVec
  layout: LayoutCoord
}

export interface UiContext {
  canceling: boolean
  detail?: UiDetailContent
  balloon?: BalloonProps
  m: OpenCloseMap
  animationEnded: {
    header: boolean
    detail: boolean
  }
}

// XXX
// XXX
// XXX
type UiModeEventDetailArgs = Pick<
  UiDetailContent,
  'psvg' | 'fidx' | 'info' | 'layout'
>
export type UiModeEventDetail = { type: 'DETAIL' } & UiModeEventDetailArgs
// XXX
// XXX
// XXX

export type UiModeEvent =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'FLOOR' }
  | { type: 'MENU' }
  | UiModeEventDetail
  | { type: 'HELP' }
  | { type: 'RENDERED' }

export type UiPartEvent =
  | { type: 'HEADER.ANIMATION.END' }
  | { type: 'DETAIL.ANIMATION.END' }

export type UiInternalEvent = { type: 'DONE' }

export type UiEvent = UiModeEvent | UiPartEvent | UiInternalEvent

export type UiEmitted = { type: 'CLOSE.DONE' }

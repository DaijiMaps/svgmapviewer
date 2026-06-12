import { type SearchRes } from '../../types'
import { type VecVec } from '../vec/prefixed'
import { type LayoutCoord } from '../viewer/layout/coord'
import type { BalloonPaths, BalloonProps } from './balloon-common'
import { type OpenClose } from './openclose'

export type UiPart = 'header' | 'detail'

export type OpenCloseMap = Record<UiPart, OpenClose>

export type UiDetailContent = SearchRes & {
  layout: LayoutCoord
}

export interface UiContext {
  canceling: boolean
  detail?: UiDetailContent
  balloon?: BalloonProps
  balloonPaths?: BalloonPaths
  p?: VecVec
  m: OpenCloseMap
  animationEnded: {
    header: boolean
    detail: boolean
  }
}

export type UiModeEvent =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'FLOOR' }
  | { type: 'MENU' }
  | ({ type: 'DETAIL' } & UiDetailContent)
  | { type: 'HELP' }
  | { type: 'RENDERED' }

export type UiPartEvent =
  | { type: 'HEADER.ANIMATION.END' }
  | { type: 'DETAIL.ANIMATION.END' }

export type UiInternalEvent = { type: 'DONE' }

export type UiEvent = UiModeEvent | UiPartEvent | UiInternalEvent

export type UiEmitted = { type: 'CLOSE.DONE' }

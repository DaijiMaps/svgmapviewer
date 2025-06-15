import { type LayoutCoord } from './coord'
import { type OpenClose } from './openclose'
import { type SearchRes } from './types'
import { type VecVec } from './vec/prefixed'

export type UiPart = 'header' | 'detail'

export type OpenCloseMap = Record<UiPart, OpenClose>

export type UiDetailContent = SearchRes & {
  p: VecVec
  layout: LayoutCoord
}

export interface UiContext {
  all: OpenClose
  canceling: boolean
  detail: UiDetailContent
  m: OpenCloseMap
}

export type UiModeEvent =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'FLOOR' }
  | { type: 'MENU' }
  | ({ type: 'DETAIL' } & Pick<UiDetailContent, 'psvg' | 'info' | 'layout'>)
  | { type: 'HELP' }

export type UiPartEvent =
  | { type: 'HEADER.ANIMATION.END' }
  | { type: 'DETAIL.ANIMATION.END' }

export type UiInternalEvent = { type: 'DONE' }

export type UiEvent = UiModeEvent | UiPartEvent | UiInternalEvent

export type UiEmitted = { type: 'CLOSE.DONE' }

/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { Box } from './box/main'
import { Vec } from './vec'

interface Info {
  title: string
}

export type { Info }

export interface SearchReq {
  p: Vec
  psvg: Vec
}

export interface SearchRes {
  p: Vec
  psvg: Vec
  info: Readonly<Info>
}

export type SearchCb = (p: Vec, psvg: Vec) => void

export type SearchDoneCb = (res: Readonly<null | SearchRes>) => void

export type UiOpenCb = (p: Vec, psvg: Vec, info: Readonly<Info>) => void

export type UiOpenDoneCb = (ok: boolean) => void

export type UiCloseCb = () => void

export type RenderInfo = (props: Readonly<{ info: Info }>) => JSX.Element

export interface SvgMapViewerConfig {
  root: string
  map: string
  href: string
  width: number
  height: number
  fontSize: number
  origViewBox: Box
  title: string
  subtitle: string
  copyright: string
  zoomFactor: number
  animationDuration: number
  dragStepAlpha: number
  dragStepStepLimit: number
  dragStepMaxCount: number
  searchStartCbs: SearchCb[]
  searchCbs: SearchCb[]
  searchDoneCbs: SearchDoneCb[]
  searchEndCbs: SearchDoneCb[]
  uiOpenCbs: UiOpenCb[]
  uiOpenDoneCbs: UiOpenDoneCb[]
  uiCloseCbs: UiCloseCb[]
  uiCloseDoneCbs: UiCloseCb[]
  renderInfo: RenderInfo
}

export type SvgMapViewerConfigUser = Partial<SvgMapViewerConfig>

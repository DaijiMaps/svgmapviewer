import type { Cb } from './cb'

export interface ActionCbs {
  zoomIn: Set<Cb>
  zoomOut: Set<Cb>
  reset: Set<Cb>
  recenter: Set<Cb>
  rotate: Set<Cb>
  position: Set<Cb>
  fullscreen: Set<Cb>
}

export type ViewerActionType =
  | 'ZOOM.IN'
  | 'ZOOM.OUT'
  | 'RESET'
  | 'RECENTER'
  | 'ROTATE'

export type ViewerAction = { type: ViewerActionType }

import type { Cb } from './cb'

export interface ActionCbs {
  readonly zoomIn: Set<Cb>
  readonly zoomOut: Set<Cb>
  readonly reset: Set<Cb>
  readonly recenter: Set<Cb>
  readonly rotate: Set<Cb>
  readonly position: Set<Cb>
  readonly fullscreen: Set<Cb>
}

export type ViewerActionType =
  | 'ZOOM.IN'
  | 'ZOOM.OUT'
  | 'RESET'
  | 'RECENTER'
  | 'ROTATE'

export type ViewerAction = { readonly type: ViewerActionType }

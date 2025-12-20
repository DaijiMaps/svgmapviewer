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

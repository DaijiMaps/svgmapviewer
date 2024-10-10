import { V } from './main'

export function Vadd([ax, ay]: V, [bx, by]: V): V {
  return [ax + bx, ay + by]
}

export function Vsub([ax, ay]: V, [bx, by]: V): V {
  return [ax - bx, ay - by]
}

export function Vmul([ax, ay]: V, [bx, by]: V): V {
  return [ax * bx, ay * by]
}

export function Vdiv([ax, ay]: V, [bx, by]: V): V {
  return [ax / bx, ay / by]
}

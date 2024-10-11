// V == virtical (part of matrix)

export type V = readonly [s: number, t: number]

export function add([ax, ay]: V, [bx, by]: V): V {
  return [ax + bx, ay + by]
}

export function sub([ax, ay]: V, [bx, by]: V): V {
  return [ax - bx, ay - by]
}

export function mul([ax, ay]: V, [bx, by]: V): V {
  return [ax * bx, ay * by]
}

export function div([ax, ay]: V, [bx, by]: V): V {
  return [ax / bx, ay / by]
}

type Vec = Readonly<{ x: number; y: number }>

export function vec([x, y]: V): Vec {
  return { x, y }
}

export function unvec({ x, y }: Vec): V {
  return [x, y]
}

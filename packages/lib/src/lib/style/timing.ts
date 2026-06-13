export const lerp = (a: number, b: number, t: number): number =>
  (1 - t) * a + t * b

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/*
function bezier(u: number, p1: number, p2: number): number {
  const v = 1 - u
  return 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u
}

function bezierDerivative(u: number, p1: number, p2: number): number {
  const v = 1 - u
  return 3 * v * v * p1 + 6 * v * u * (p2 - p1) + 3 * u * u * (1 - p2)
}

export function easeCubic(t: number): number {
  let u = t

  for (let i = 0; i < 4; i++) {
    u -= (bezier(u, 0.25, 0.25) - t) / bezierDerivative(u, 0.25, 0.25)
  }

  return bezier(u, 0.1, 1.0)
}
*/

// super simplified/approximate version
export const easeCubic = (t: number): number => 1 - (1 - t) ** 3

export function Tree2x4() {
  return (
    <path
      id="Xtree-2x4"
      d={tree2x4Path}
      fill="none"
      stroke="black"
      strokeWidth="0.1"
    />
  )
}

export const tree2x4Path =
  'm 0,0 0,-2 m 0,1 c 1.5,0 1,-3 0,-3 c -1,0 -1.5,3 0,3 z'

export function Tree4x8() {
  return (
    <path
      id="Xtree-4x8"
      d={tree4x8Path}
      fill="none"
      stroke="black"
      strokeWidth="0.2"
    />
  )
}

export const tree4x8Path = 'm 0,0 0,-4 m 0,2 c 3,0 2,-6 0,-6 c -2,0 -3,6 0,6 z'

export function Tree8x8() {
  return (
    <path
      id="Xtree-8x8"
      d={tree8x8Path}
      fill="none"
      stroke="black"
      strokeWidth="0.2"
    />
  )
}

export const tree8x8Path = 'm 0,0 v -4 m 0,2 c 6,0 4,-6 0,-6 -4,0 -6,6 0,6 z'

export function Tree8x16() {
  return (
    <path
      id="Xtree-8x16"
      d={tree8x16Path}
      fill="none"
      stroke="black"
      strokeWidth="0.3"
    />
  )
}

export const tree8x16Path =
  'm 0,0 v -8 m 0,4 c 6,0 4,-12 0,-12 -4,0 -6,12 0,12 z'

export function Tree16x16() {
  return (
    <path
      id="Xtree-16x16"
      d={tree16x16Path}
      fill="none"
      stroke="black"
      strokeWidth="0.4"
    />
  )
}

export const tree16x16Path =
  'm 0,0 v -8 m 0,4 c 12,0 8,-12 0,-12 -8,0 -12,12 0,12 z'

export function Statue(): ReactNode {
  return (
    <path
      id="Xstatue"
      d={statuePath}
      fill="none"
      stroke="black"
      strokeWidth="0.075"
    />
  )
}

export const statuePath =
  'm -0.5 0 v -0.3 h 1 v 0.3 m -0.5 -0.3 s -0.4 -0.75 0 -0.75 h 0 a 0.125 0.125 0 0 1 0 -0.25 a 0.125 0.125 0 0 1 0 0.25 s 0.4 0 0 0.75'

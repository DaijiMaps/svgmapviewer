export function Entrance(): ReactNode {
  return (
    <path
      id="Xentrance"
      d={entrancePath}
      fill="none"
      stroke="black"
      strokeWidth="0.0675"
    />
  )
}

export const entrancePath =
  'm 0,1 h -1 v -2 h 2 v 2 h -1 v -2 m -0.5,1 m -0.2,-0.2 l 0.2,0.2 l -0.2,0.2 m 0.2,-0.2 h -1'

export function VendingMachine(): ReactNode {
  return (
    <path
      id="XvendingMachine"
      d={vendingMachinePath}
      fill="none"
      stroke="black"
      strokeWidth="0.05"
    />
  )
}

export const vendingMachinePath =
  'm -0.5,0 v -1.8 h 1 v 1.8 z m 0.1,-0.9 v -0.7 h 0.8 v 0.7 z m 0.6,0.2 h 0.2 m -0.7,0.5 v -0.2 h 0.6 v 0.2 z'

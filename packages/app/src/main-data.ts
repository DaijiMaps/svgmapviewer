import {
  BoxBox as Box,
  VecVec as Vec,
  vecAdd,
  vecSub,
} from '@daijimaps/svgmapviewer'

type Address = string

const viewBox: Box = { x: -100, y: -100, width: 793.70079, height: 1122.5197 }

const d: Vec = { x: 18 / 2, y: 18 / 2 }

export const addressEntries: { a: Address; psvg: Vec }[] = [
  { a: 'Toilet1', psvg: { x: 166.12501, y: 293.49998 } },
  { a: 'Toilet2', psvg: { x: 483.43751, y: 701.18747 } },
  { a: 'Toilet3', psvg: { x: 577.87501, y: -3.7500042 } },
  { a: 'Toilet4', psvg: { x: 473.37501, y: 961.93746 } },
  { a: 'Parking1', psvg: { x: 82.88086, y: 355.5078 } },
  { a: 'Parking2', psvg: { x: 520.74513, y: 945.50777 } },
  { a: 'Smoking1', psvg: { x: 30.03321, y: 443.35545 } },
  { a: 'Smoking2', psvg: { x: 600.03322, y: 693.35544 } },
  { a: 'Smoking3', psvg: { x: 610.03322, y: -26.64453 } },
  { a: 'Info1', psvg: { x: 120.50782, y: 236.69432 } },
  { a: 'Fountains1', psvg: { x: 504.3047, y: 691.81295 } },
  { a: 'Fountains2', psvg: { x: 184.30469, y: 301.81297 } },
  { a: 'Fountains3', psvg: { x: 584.3047, y: -18.18702 } },
].map(({ a, psvg }) => ({ a, psvg: vecAdd(vecSub(psvg, viewBox), d) }))

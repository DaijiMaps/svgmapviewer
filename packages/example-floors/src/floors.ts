import { type FloorsConfig } from 'svgmapviewer'
import floor_1f from './assets/floor-1f.svg'
import floor_2f from './assets/floor-2f.svg'

export const floorsConfig: FloorsConfig = {
  floors: [
    { name: '1F', href: floor_1f },
    { name: '2F', href: floor_2f },
  ],
  initialFidx: 0,
}

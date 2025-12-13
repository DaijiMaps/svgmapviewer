import { type FloorsConfig } from 'svgmapviewer'
import floor1f from './assets/1f.svg'
import floor2f from './assets/2f.svg'

export const floorsConfig: FloorsConfig = {
  floors: [
    { name: '1F', href: floor1f },
    { name: '2F', href: floor2f },
  ],
  fidx: 0,
}

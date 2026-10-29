import { type FloorsConfig } from 'svgmapviewer'

import { floors } from './data/floors'

const labelsMap = new Map([
  [
    '1f',
    [
      {
        attrs: {
          x: 100,
          y: 100,
          rotate: 90,
          scale2: 1,
          scale1: 1,
          dy: 0,
        },
        children: [
          {
            attrs: {
              x: 0,
              y: 0,
            },
            text: '日本語のテスト',
          },
        ],
      },
    ],
  ],
])

export const floorsConfig: FloorsConfig = {
  floors,
  initialFidx: 0,
  labelsMap,
}

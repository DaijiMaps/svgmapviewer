import { type POI } from './types.ts'

export const pois: POI[] = [
  {
    id: 0,
    name: 'a',
    pos: { x: 0, y: 0 },
    size: 10,
    fidx: 0,
    x: {
      tag: 'facility',
      kind: {
        tag: 'toilet',
      },
    },
  },
  {
    id: 1,
    name: ['みんなの', 'フードコート'],
    pos: { x: 100, y: 100 },
    size: 10,
    fidx: 0,
    x: {
      tag: 'shop',
      kind: {
        tag: 'restaurant',
      },
    },
  },
  {
    id: 2,
    name: '書店',
    pos: { x: 100, y: 50 },
    size: 10,
    fidx: 1,
    x: {
      tag: 'shop',
      kind: {
        tag: 'book',
      },
    },
  },
  {
    id: 3,
    name: 'd',
    pos: { x: 200, y: 200 },
    size: 10,
    fidx: 1,
    x: {
      tag: 'facility',
      kind: {
        tag: 'stairs',
      },
    },
  },
]

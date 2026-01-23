import { type POI } from '../types.ts'

export const pois: POI[] = [
  {
    id: 0,
    name: 'a',
    pos: { x: 10, y: 10 },
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
    name: ['フードコート'],
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
    name: ['ラーメン'],
    pos: { x: 100, y: 30 },
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
    id: 3,
    name: ['寿司'],
    pos: { x: 140, y: 40 },
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
    id: 3,
    name: ['パスタ'],
    pos: { x: 150, y: 70 },
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
    id: 4,
    name: ['ハンバーガー'],
    pos: { x: 180, y: 110 },
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
    id: 5,
    name: ['クレープ'],
    pos: { x: 190, y: 140 },
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
    id: 6,
    name: ['パン'],
    pos: { x: 90, y: 140 },
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
    id: 201,
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
    id: 202,
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

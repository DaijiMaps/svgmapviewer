import { type V } from '../tuple'

export type Point = V
export type Line = readonly V[]
export type MultiLineString = readonly Line[]
export type MultiPolygon = readonly MultiLineString[]

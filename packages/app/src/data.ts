import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'

type Address = string

export const addressEntries: { a: Address; lonlat: Vec }[] = [
  { a: 'Toilet1', lonlat: { x: 139.7132595, y: 35.6847844 } },
  { a: 'Toilet2', lonlat: { x: 139.712321, y: 35.686835 } },
  { a: 'Toilet3', lonlat: { x: 139.7130809, y: 35.6859534 } },
  { a: 'Toilet4', lonlat: { x: 139.709856, y: 35.6828 } },
  { a: 'Toilet5', lonlat: { x: 139.709047, y: 35.682401 } },
  { a: 'Toilet6', lonlat: { x: 139.705213, y: 35.6849034 } },
  { a: 'Toilet7', lonlat: { x: 139.7078862, y: 35.6884949 } },
  { a: 'Toilet8', lonlat: { x: 139.70844360000001, y: 35.6857521 } },
  { a: 'Toilet9', lonlat: { x: 139.7136036, y: 35.6865013 } },
  { a: 'Toilet10', lonlat: { x: 139.707878636771142, y: 35.686922812053346 } },
  { a: 'Toilet11', lonlat: { x: 139.706648639183186, y: 35.686963927959432 } },
  { a: 'Toilet12', lonlat: { x: 139.7111965, y: 35.6838438 } },
  { a: 'Toilet13', lonlat: { x: 139.711948145955347, y: 35.683465495929084 } },
  { a: 'Toilet14', lonlat: { x: 139.708966200262296, y: 35.68416386267895 } },
  { a: 'Toilet15', lonlat: { x: 139.710398045789958, y: 35.686975152058096 } },
  { a: 'Toilet16', lonlat: { x: 139.709644076318483, y: 35.68541843935806 } },
  { a: 'Toilet17', lonlat: { x: 139.707964383178165, y: 35.688219878353387 } },
  { a: 'Toilet18', lonlat: { x: 139.7080349, y: 35.6881866 } },
  { a: 'Toilet19', lonlat: { x: 139.71404045, y: 35.68692125 } },
].map(({ a, lonlat }) => ({ a, lonlat: lonlat }))

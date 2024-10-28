import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import centroids from './data/map-centroids.json'
import points from './data/map-points.json'

const pointAddresses = () =>
  points.features.flatMap((f) => {
    if (f.properties.name?.match(/./)) {
      const x = f.geometry.coordinates[0]
      const y = f.geometry.coordinates[1]
      const a = `lon=${x},lat=${y}`
      return [{ a, lonlat: { x, y } }]
    } else if (f.properties.other_tags?.match(/"toilets"/)) {
      const x = f.geometry.coordinates[0]
      const y = f.geometry.coordinates[1]
      const a = `lon=${x},lat=${y}`
      return [{ a, lonlat: { x, y } }]
    } else {
      return []
    }
  })

const centroidAddresses = () =>
  centroids.features.flatMap((f) => {
    if (f.properties.name?.match(/./)) {
      const x = f.geometry.coordinates[0]
      const y = f.geometry.coordinates[1]
      const a = `lon=${x},lat=${y}`
      return [{ a, lonlat: { x, y } }]
    } else if (f.properties.other_tags?.match(/"toilets"/)) {
      const x = f.geometry.coordinates[0]
      const y = f.geometry.coordinates[1]
      const a = `lon=${x},lat=${y}`
      return [{ a, lonlat: { x, y } }]
    } else {
      return []
    }
  })

export const addressEntries: { a: string; lonlat: Vec }[] = [
  ...pointAddresses(),
  ...centroidAddresses(),
]

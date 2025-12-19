import path from 'node:path'

const dir = (subdir: string): string => path.resolve(__dirname, subdir)

export const alias = {
  'svgmapviewer-app-osm': dir('./src/index.ts'),
}

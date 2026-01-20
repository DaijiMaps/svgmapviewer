import path from 'node:path'
const dir = (subdir) => path.resolve(__dirname, subdir)
export const alias = {
  'svgmapviewer/box': dir('./src/lib/box/prefixed/index.ts'),
  'svgmapviewer/carto-objects': dir('./src/lib/carto/objects/index.ts'),
  'svgmapviewer/carto-symbols': dir('./src/lib/carto/symbols/index.ts'),
  'svgmapviewer/carto': dir('./src/lib/carto/index.ts'),
  'svgmapviewer/css': dir('./src/lib/css/index.ts'),
  'svgmapviewer/geo': dir('./src/lib/geo/index.ts'),
  'svgmapviewer/map-floors': dir('./src/lib/map/floors/index.ts'),
  'svgmapviewer/map': dir('./src/lib/map/index.ts'),
  'svgmapviewer/matrix': dir('./src/lib/matrix/prefixed/index.ts'),
  'svgmapviewer/search': dir('./src/lib/search/index.ts'),
  'svgmapviewer/tuple': dir('./src/lib/tuple/index.ts'),
  'svgmapviewer/vec': dir('./src/lib/vec/prefixed/index.ts'),
  svgmapviewer: dir('./src/index.ts'),
}

import { svgmapviewer } from 'svgmapviewer-app-floors'
import { floorsConfig } from './floors'
import { searchConfig } from './search'

// eslint-disable-next-line functional/no-expression-statements
svgmapviewer({
  origViewBox: {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  floorsConfig,

  ...searchConfig,
})

/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-floors'
import { floorsConfig } from './floors'
import { searchConfig } from './search'

svgmapviewer({
  root: 'root',
  origViewBox: {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  floorsConfig,

  ...searchConfig,
})

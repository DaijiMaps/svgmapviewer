/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-floors'
import { floorsConfig } from './floors'
import { searchConfig } from './search'

svgmapviewer({
  root: 'root',
  title: 'Floor Map Test',
  origViewBox: {
    x: 0,
    y: 0,
    width: 220,
    height: 300,
  },
  zoomFactor: 2,
  floorsConfig,

  ...searchConfig,
})

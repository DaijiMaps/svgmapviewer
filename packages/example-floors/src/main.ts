/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-floors'

import { floorsConfig } from './floors'
import { searchConfig } from './search'
import { origBoundingBox, origViewBox } from './viewbox'

svgmapviewer({
  root: 'root',
  title: 'Floor Map Test',
  origViewBox,
  origBoundingBox,
  zoomFactor: 2,
  floorsConfig,

  ...searchConfig,
})

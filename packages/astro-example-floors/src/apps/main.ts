/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-floors'

import { floorsConfig } from './floors'
import { searchConfig } from './search'
import { origBoundingBox, origViewBox } from './viewbox'

export function main() {
  svgmapviewer({
    root: 'root',
    title: 'Floor Map Test',
    origViewBox,
    origBoundingBox,
    zoomFactor: 2,
    floorsConfig,

    ...searchConfig,
  })
}

//main()

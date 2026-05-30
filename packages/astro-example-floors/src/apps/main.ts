import type { SvgMapViewerConfigUser } from 'svgmapviewer'
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-floors'

import { floorsConfig } from './floors'
import { searchConfig } from './search'

export function main(props: Readonly<SvgMapViewerConfigUser>) {
  svgmapviewer({
    ...props,

    //root: 'root',
    //title: 'Floor Map Test',
    //zoomFactor: 2,
    floorsConfig,

    ...searchConfig,
    getInfoByName: (name: string) => ({
      title: name,
      x: {
        tag: 'unknown',
      },
    }),
  })
}

//main()

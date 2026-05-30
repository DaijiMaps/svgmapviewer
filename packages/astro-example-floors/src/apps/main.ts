/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { svgmapviewer } from 'svgmapviewer-app-floors'

import { RenderInfo as renderInfo } from './render'

export function main(props: Readonly<SvgMapViewerConfigUser>) {
  svgmapviewer({
    ...props,

    getInfoByName: (name: string) => ({
      title: name,
      x: {
        tag: 'unknown',
      },
    }),
    renderInfo,
  })
}

//main()

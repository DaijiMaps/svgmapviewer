/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { svgmapviewer } from 'svgmapviewer-app-floors'

export function main(props: Readonly<SvgMapViewerConfigUser>) {
  svgmapviewer({
    ...props,
  })
}

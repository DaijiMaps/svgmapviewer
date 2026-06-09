/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useEffect } from 'react'
import type { SvgMapViewerConfigUser } from 'svgmapviewer'

import { main } from './main'

export function SvgMapViewer(props: Readonly<SvgMapViewerConfigUser>) {
  useEffect(() => {
    main(props)
  }, [props])

  return (
    <>
      <div id="root"></div>
      <div id="style-root"></div>
    </>
  )
}

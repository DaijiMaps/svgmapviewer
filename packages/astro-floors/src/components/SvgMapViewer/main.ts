/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { svgmapviewer } from 'svgmapviewer-app-floors'
import { calcScale2, type MapCoord } from 'svgmapviewer/geo'
import { vecZero } from 'svgmapviewer/vec'

export function main(props: Readonly<SvgMapViewerConfigUser>) {
  // XXX
  // XXX
  // XXX move matrix re-calculation into svgmapviewer()
  // XXX
  // XXX
  const { mapCoord: tmp } = calcScale2(
    props.mapCoord?.svgp ?? vecZero,
    props.mapCoord?.svgq ?? vecZero,
    props.mapCoord?.geop ?? vecZero,
    props.mapCoord?.geoq ?? vecZero
  )
  const mapCoord: MapCoord = {
    matrix: tmp.matrix,
    direct: props.mapCoord?.direct,
  }
  svgmapviewer({
    ...props,
    base: import.meta.env.BASE_URL,
    mapCoord,
  })
}

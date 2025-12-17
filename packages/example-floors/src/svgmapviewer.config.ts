import { type SvgMapViewerConfigUser } from 'svgmapviewer'
import mapConfig from './map'

const userConfig: SvgMapViewerConfigUser = {
  title: 'Example Floor Map',
  zoomFactor: 2,
  cartoConfig: {
    backgroundColor: 'grey',
  },
  ...mapConfig,
}

export default userConfig

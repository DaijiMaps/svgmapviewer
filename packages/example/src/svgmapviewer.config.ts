import { SvgMapViewerConfigUser } from 'svgmapviewer'
import mapConfig from './map.config'

const userConfig: SvgMapViewerConfigUser = {
  title: 'Example Floor Map',
  zoomFactor: 2,
  cartoConfig: {
    backgroundColor: 'grey',
  },
  ...mapConfig
}

export default userConfig

import { type SvgMapViewerConfigUser } from 'svgmapviewer'
import { searchConfig } from './search'
import { floorsConfig } from './floors.config'
import { floorsCommonConfig } from './config'
import { RenderInfo as renderInfo } from './render'

const userConfig: SvgMapViewerConfigUser = {
  origViewBox: {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  title: 'Example Floor Map',
  backgroundColor: 'grey',
  zoomFactor: 2,

  cartoConfig: {
    backgroundColor: 'grey',
  },

  ...floorsCommonConfig,
  ...searchConfig,

  renderInfo,

  floorsConfig,
}

export default userConfig

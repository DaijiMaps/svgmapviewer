import { type SvgMapViewerConfigUser } from 'svgmapviewer'
import { floorsCommonConfig } from './config'
import { floorsConfig } from './floors'
import { RenderInfo as renderInfo } from './render'
import { searchConfig } from './search'

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

/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer'
import { renderConfig, searchConfig } from 'svgmapviewer-app-osm'
import { dataConfig } from './map-data'

import userConfig from '../svgmapviewer.config'

svgmapviewer({
  ...dataConfig,
  ...renderConfig,
  ...searchConfig,
  ...userConfig,
  root: 'root',
})

/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-osm'
import { mapData } from './data/all'

svgmapviewer({
  root: 'root',
  mapData,
})

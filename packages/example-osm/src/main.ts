/* eslint-disable functional/no-expression-statements */
import { svgmapviewer } from 'svgmapviewer-app-osm'

import { mapData } from './data/all'

// XXX
// XXX
// XXX

svgmapviewer({
  root: 'root',
  title: 'Yugyoji',
  copyright: '@ Daiji Maps | map data @ OpenStreetMap contributers',
  zoomFactor: 3,
  mapData,
})

// XXX
// XXX
// XXX

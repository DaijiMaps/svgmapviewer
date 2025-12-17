/* eslint-disable functional/no-expression-statements */
import { defineConfig } from 'svgmapviewer-app-osm'

import userConfig from '../svgmapviewer.config'

import { mapData } from './data/all'

// XXX
// XXX
// XXX

defineConfig({ ...userConfig, mapData })

// XXX
// XXX
// XXX

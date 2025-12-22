/* eslint-disable functional/functional-parameters */
import { type OsmMapPaths } from 'svgmapviewer/carto'
import { area } from './paths/area'
import { bridge } from './paths/bridge'
import { building } from './paths/building'
import { cliff } from './paths/cliff'
import { cycleway } from './paths/cycleway'
import { ditch } from './paths/ditch'
import { drain } from './paths/drain'
import { escalator } from './paths/escalator'
import { farmland } from './paths/farmland'
import { fence } from './paths/fence'
import { footway } from './paths/footway'
import { forest } from './paths/forest'
import { garden } from './paths/garden'
import { grass } from './paths/grass'
import { grave_yard } from './paths/grave_yard'
import { island } from './paths/island'
import { parking } from './paths/parking'
import { path } from './paths/path'
import { pedestrian } from './paths/pedestrian'
import { pedestrian_area } from './paths/pedestrian_area'
import { playground } from './paths/playground'
import { retaining_wall } from './paths/retaining_wall'
import { river } from './paths/river'
import { road } from './paths/road'
import { rock } from './paths/rock'
import { roof } from './paths/roof'
import { service } from './paths/service'
import { steps } from './paths/steps'
import { stream } from './paths/stream'
import { wall } from './paths/wall'
import { water } from './paths/water'
import { wetland } from './paths/wetland'

export const getMapPaths: () => OsmMapPaths[] = () =>
  [
    island,
    area,
    cliff,
    rock,
    grass,
    forest,
    garden,
    farmland,
    water,
    ditch,
    drain,
    stream,
    river,
    wetland,
    playground,
    grave_yard,
    parking,
    building,
    path,
    footway,
    steps,
    cycleway,
    service,
    pedestrian,
    road,
    pedestrian_area,
    escalator,
    wall,
    fence,
    retaining_wall,
    bridge,
    roof,
  ].flat()

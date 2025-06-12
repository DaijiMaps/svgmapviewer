/* eslint-disable functional/functional-parameters */
import { svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { MapLayer } from '@daijimaps/svgmapviewer/carto'
import { MultiPolygon } from '@daijimaps/svgmapviewer/geo'

export const getMapLayers: () => MapLayer[] = () => [
  {
    type: 'multipolygon',
    name: 'area',
    data: svgMapViewerConfig.mapData.internals.features.map(
      (f) => f.geometry.coordinates
    ) as unknown as MultiPolygon[],
  },
  {
    type: 'multipolygon',
    name: 'rock',
    filter: (p) => !!p.natural?.match(/bare_rock/),
  },
  {
    type: 'multipolygon',
    name: 'grass',
    filter: (p) => !!p.landuse?.match(/grass/),
  },
  {
    type: 'multipolygon',
    name: 'forest',
    filter: (p) => !!p.landuse?.match(/forest/) || !!p.natural?.match(/wood/),
  },
  {
    type: 'multipolygon',
    name: 'garden',
    filter: (p) => !!p.leisure?.match(/garden/),
  },
  {
    type: 'multipolygon',
    name: 'water',
    filter: (p) => !!p.natural?.match(/^water$/),
  },
  {
    type: 'line',
    name: 'ditch',
    filter: (p) => !!p.waterway?.match(/^(ditch)$/),
  },
  {
    type: 'line',
    name: 'stream',
    filter: (p) => !!p.waterway?.match(/^(stream)$/),
  },
  {
    type: 'line',
    name: 'river',
    filter: (p) => !!p.waterway?.match(/^(river)$/),
  },
  {
    type: 'multipolygon',
    name: 'wetland',
    filter: (p) => !!p.natural?.match(/wetland/),
  },
  {
    type: 'multipolygon',
    name: 'playground',
    filter: (p) =>
      !!p.tourism?.match(/zoo/) ||
      !!p.leisure?.match(/ice_rink|pitch|playground/) ||
      !!p.landuse?.match(/recreation_ground/),
  },
  {
    type: 'multipolygon',
    name: 'grave_yard',
    filter: (p) => !!p.amenity?.match(/grave_yard/),
  },
  {
    type: 'multipolygon',
    name: 'parking',
    filter: (p) => !!p.amenity?.match(/(parking|bicycle_parking)/),
  },
  {
    type: 'multipolygon',
    name: 'building',
    filter: (p) => !!p.building?.match(/./) && !p.building?.match(/roof/),
  },
  {
    type: 'line',
    name: 'path',
    width: 1,
    filter: (p) => !!p.highway?.match(/^(path|track)$/),
  },
  {
    type: 'line',
    name: 'footway',
    width: 1,
    filter: (p) => !!p.highway?.match(/^(footway|steps)$/),
  },
  {
    type: 'line',
    name: 'steps',
    width: 1,
    filter: (p) => !!p.highway?.match(/^(steps)$/),
  },
  {
    type: 'line',
    name: 'cycleway',
    width: 3,
    filter: (p) => !!p.highway?.match(/^(cycleway)$/),
  },
  {
    type: 'line',
    name: 'service',
    width: 4,
    filter: (p) => !!p.highway?.match(/^(service)$/),
  },
  {
    type: 'line',
    name: 'pedestrian',
    width: 8,
    filter: (p) => !!p.highway?.match(/^(pedestrian)$/),
  },
  {
    type: 'line',
    name: 'road',
    width: 6,
    filter: (p) =>
      !!p.highway?.match(/./) &&
      !p.highway?.match(
        /^(footway|path|pedestrian|steps|cycleway|track|service)$/
      ),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (p) =>
      !!p.other_tags?.match(/("highway"=>"service"|"area:highway"=>"service")/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (p) => !!p.man_made?.match(/bridge/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (p) => !!p.other_tags?.match(/"pedestrian"/),
  },
  {
    type: 'line',
    name: 'escalator background',
    filter: (p) =>
      !!p.highway?.match(/^(steps)$/) &&
      !!p.other_tags?.match(/"conveying"=>"yes"/),
  },
  {
    type: 'line',
    name: 'escalator foreground',
    filter: (p) =>
      !!p.highway?.match(/^(steps)$/) &&
      !!p.other_tags?.match(/"conveying"=>"yes"/),
  },
  {
    type: 'line',
    name: 'wall',
    filter: (p) => !!p.barrier?.match(/^(wall)$/),
  },
  {
    type: 'line',
    name: 'fence',
    filter: (p) => !!p.barrier?.match(/^(fence)$/),
  },
  {
    type: 'line',
    name: 'retaining-wall',
    filter: (p) => !!p.barrier?.match(/^(retaining_wall)$/),
  },
  {
    type: 'multipolygon',
    name: 'roof',
    filter: (p) => !!p.building?.match(/./) && !!p.building?.match(/roof/),
  },
]

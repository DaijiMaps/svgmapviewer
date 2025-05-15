import { MapLayer } from '@daijimaps/svgmapviewer/carto'
//import { MultiPolygon } from '@daijimaps/svgmapviewer/geo'
//import internals from './data/internals.json'
import './map.css'

export const getMapLayers: () => MapLayer[] = () => [
  /*
  {
    type: 'multipolygon',
    name: 'area',
    data: internals.features.map(
      (f) => f.geometry.coordinates
    ) as unknown as MultiPolygon[],
  },
  */
  {
    type: 'multipolygon',
    name: 'grass',
    filter: (f) => !!f.properties.landuse?.match(/grass/),
  },
  {
    type: 'multipolygon',
    name: 'forest',
    filter: (f) =>
      !!f.properties.landuse?.match(/forest/) ||
      !!f.properties.natural?.match(/wood/),
  },
  {
    type: 'multipolygon',
    name: 'garden',
    filter: (f) => !!f.properties.leisure?.match(/garden/),
  },
  {
    type: 'multipolygon',
    name: 'water',
    filter: (f) => !!f.properties.natural?.match(/^water$/),
  },
  {
    type: 'line',
    name: 'ditch',
    filter: (f) =>
      !!f.properties.waterway?.match(/^(ditch)$/) &&
      !f.properties.other_tags?.match(/"tunnel"=>"(yes|culvert)"/),
  },
  {
    type: 'line',
    name: 'stream',
    filter: (f) =>
      !!f.properties.waterway?.match(/^(stream)$/) &&
      !f.properties.other_tags?.match(/"tunnel"=>"(yes|culvert)"/),
  },
  {
    type: 'line',
    name: 'river',
    filter: (f) =>
      !!f.properties.waterway?.match(/^(river)$/) &&
      !f.properties.other_tags?.match(/"tunnel"=>"(yes|culvert)"/),
  },
  {
    type: 'multipolygon',
    name: 'building',
    filter: (f) =>
      !!f.properties.building?.match(/./) &&
      !f.properties.building?.match(/roof/),
  },
  {
    type: 'line',
    name: 'footway',
    filter: (f) =>
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/^(footway|path|pedestrian|steps)$/) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'footway access',
    filter: (f) =>
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/^(footway|path|pedestrian|steps)$/) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !!f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'cycleway',
    filter: (f) =>
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/^(cycleway)$/) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'path',
    filter: (f) =>
      //!f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/^(path|track)$/) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'service',
    filter: (f) =>
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/^(service)$/) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'service access',
    filter: (f) =>
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/^(service)$/) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !!f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'road',
    filter: (f) =>
      !f.properties.other_tags?.match(/"level"=>"[1-9][^"]*"/) &&
      !!f.properties.highway?.match(/./) &&
      !f.properties.highway?.match(
        /^(footway|path|pedestrian|steps|cycleway|track|service)$/
      ) &&
      !f.properties.other_tags?.match(/"service"=>/) &&
      !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (f) =>
      !!f.properties.other_tags?.match(
        /("highway"=>"service"|"area:highway"=>"service")/
      ) && !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'multipolygon',
    name: 'pedestrian-area',
    filter: (f) =>
      !!f.properties.other_tags?.match(/"pedestrian"/) &&
      !f.properties.other_tags?.match(/"access"=>/),
  },
  {
    type: 'line',
    name: 'escalator-background',
    filter: (f) =>
      !!f.properties.highway?.match(/^(steps)$/) &&
      !!f.properties.other_tags?.match(/"conveying"=>"yes"/),
  },
  {
    type: 'line',
    name: 'escalator foreground',
    filter: (f) =>
      !!f.properties.highway?.match(/^(steps)$/) &&
      !!f.properties.other_tags?.match(/"conveying"=>"yes"/),
  },
  {
    type: 'line',
    name: 'wall',
    filter: (f) => !!f.properties.barrier?.match(/^(wall)$/),
  },
  {
    type: 'line',
    name: 'fence',
    filter: (f) => !!f.properties.barrier?.match(/^(fence)$/),
  },
  {
    type: 'line',
    name: 'retaining-wall',
    filter: (f) => !!f.properties.barrier?.match(/^(retaining_wall)$/),
  },
  {
    type: 'multipolygon',
    name: 'roof',
    filter: (f) =>
      !!f.properties.building?.match(/./) &&
      !!f.properties.building?.match(/roof/),
  },
]

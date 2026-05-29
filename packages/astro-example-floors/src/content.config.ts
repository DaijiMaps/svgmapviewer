import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import {
  addressesSchema,
  floorsSchema,
  namesSchema,
  poiSchema,
  svgMapViewerConfigUserSchema,
} from './utils/schema'

const floors = defineCollection({
  loader: file('./src/data/floors.json'),
  schema: floorsSchema,
})

const addresses = defineCollection({
  loader: file('./src/data/addresses.json'),
  schema: addressesSchema,
})

const names = defineCollection({
  loader: file('./src/data/names.json'),
  schema: namesSchema,
})

const pois = defineCollection({
  loader: file('./src/data/pois.json'),
  schema: poiSchema,
})

const svgMapViewerConfig = defineCollection({
  loader: glob({
    base: './src/data/svgMapViewerConfig',
    pattern: '**/*.{json,yaml}',
  }),
  schema: svgMapViewerConfigUserSchema,
})

export const collections = {
  floors,
  addresses,
  names,
  pois,
  svgMapViewerConfig,
}

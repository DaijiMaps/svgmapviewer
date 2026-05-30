import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import {
  addressesSchema,
  floorsConfigSchema,
  namesSchema,
  poiSchema,
  svgMapViewerConfigUserSchema,
} from './utils/schema'

const floors = defineCollection({
  loader: file('./src/data/floors.{json,yaml}'),
  schema: floorsConfigSchema,
})

const addresses = defineCollection({
  loader: file('./src/data/addresses.{json,yaml}'),
  schema: addressesSchema,
})

const names = defineCollection({
  loader: file('./src/data/names.{json,yaml}'),
  schema: namesSchema,
})

const pois = defineCollection({
  loader: file('./src/data/pois.{json,yaml}'),
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

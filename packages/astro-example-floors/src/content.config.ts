import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { xinfoSchema } from './app/schema'
import {
  addressSchema,
  addrsSchema,
  floorsConfigSchema,
  svgMapViewerConfigUserSchema,
} from './utils/schema'

const floors = defineCollection({
  loader: glob({
    base: './src/data/floors',
    pattern: '**/*.{json,yaml}',
  }),
  schema: floorsConfigSchema,
})

const addresses = defineCollection({
  loader: file('./src/data/addresses.yaml'),
  schema: addressSchema,
})

const names = defineCollection({
  loader: file('./src/data/names.yaml'),
  schema: addrsSchema,
})

const pois = defineCollection({
  loader: file('./src/data/pois.yaml'),
  schema: xinfoSchema,
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

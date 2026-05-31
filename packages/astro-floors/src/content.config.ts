import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import {
  addressSchema,
  addrsSchema,
  floorsConfigSchema,
  svgMapViewerConfigUserSchema,
} from './utils/schema'

const floors = defineCollection({
  loader: glob({
    base: './src/content/floors',
    pattern: '**/*.{json,yaml}',
  }),
  schema: floorsConfigSchema,
})

const addresses = defineCollection({
  loader: file('./src/content/addresses.yaml'),
  schema: addressSchema,
})

const names = defineCollection({
  loader: file('./src/content/names.yaml'),
  schema: addrsSchema,
})

const svgMapViewerConfig = defineCollection({
  loader: glob({
    base: './src/content/svgMapViewerConfig',
    pattern: '**/*.{json,yaml}',
  }),
  schema: svgMapViewerConfigUserSchema,
})

export const collections = {
  floors,
  addresses,
  names,
  svgMapViewerConfig,
}

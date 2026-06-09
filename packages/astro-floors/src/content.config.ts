import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import {
  addressSchema,
  addrsSchema,
  floorsConfigSchema,
  labelsSchema,
  svgMapViewerConfigUserSchema,
} from './schema'

const floors = defineCollection({
  loader: glob({
    base: './src/content/floors',
    pattern: '**/*.{json,yaml}',
  }),
  schema: floorsConfigSchema,
})

const labels = defineCollection({
  loader: glob({
    base: './src/content/labels',
    pattern: '**/*.{json,yaml}',
  }),
  schema: labelsSchema,
})

const addresses = defineCollection({
  loader: file('./src/content/addresses.yaml'),
  schema: addressSchema,
})

const addressesJson = defineCollection({
  loader: file('./src/content/addresses.json'),
  schema: addressSchema,
})

const names = defineCollection({
  loader: file('./src/content/names.yaml'),
  schema: addrsSchema,
})

const namesJson = defineCollection({
  loader: file('./src/content/names.json'),
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
  addressesJson,
  labels,
  names,
  namesJson,
  svgMapViewerConfig,
}

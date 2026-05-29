import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'zod'

import {
  nameSchema,
  poiSchema,
  posSchema,
  svgMapViewerConfigSchema,
} from './utils/schema'

const floors = defineCollection({
  loader: file('./src/data/floors.json'),
  schema: z.object({
    name: nameSchema,
    // XXX labels
  }),
})

const addresses = defineCollection({
  loader: file('./src/data/addresses.json'),
  schema: z.object({
    coord: posSchema,
    fidx: z.number(),
  }),
})

const names = defineCollection({
  loader: file('./src/data/names.json'),
  schema: z.array(z.string()),
})

const pois = defineCollection({
  loader: file('./src/data/pois.json'),
  schema: poiSchema,
})

const svgMapViewerConfig = defineCollection({
  loader: glob({
    base: './src/data/svgMapViewerConfig',
    pattern: '**/*.json',
  }),
  schema: svgMapViewerConfigSchema,
})

export const collections = {
  floors,
  addresses,
  names,
  pois,
  svgMapViewerConfig,
}

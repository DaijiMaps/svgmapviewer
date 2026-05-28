import { file } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'zod'

const posSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const nameSchema = z.union([z.string(), z.array(z.string())])

const poiShopSchema = z.object({
  tag: z.literal('shop'),
})

const poiFacilitySchema = z.object({
  tag: z.literal('facility'),
})

const poiSchema = z.union([poiShopSchema, poiFacilitySchema])

const poixSchema = z.object({
  tag: z.string(),
  kind: poiSchema,
})

// ----

const floors = defineCollection({
  loader: file('./src/data/floors.json'),
  schema: z.object({
    name: nameSchema,
    // XXX labels
  }),
})

const addresses = defineCollection({
  loader: file('./src/data/addresses.json'),
  schema: posSchema,
})

const names = defineCollection({
  loader: file('./src/data/names.json'),
  schema: z.array(z.string()),
})

const pois = defineCollection({
  loader: file('./src/data/pois.json'),
  schema: z.object({
    id: z.string(),
    name: nameSchema,
    coord: posSchema,
    size: z.number(),
    fidx: z.number(),
    x: poixSchema,
  }),
})

export const collections = {
  floors,
  addresses,
  names,
  pois,
}

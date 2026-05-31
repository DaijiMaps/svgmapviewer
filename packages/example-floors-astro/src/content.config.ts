import { file } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { collections as commonCollections } from '../node_modules/svgmapviewer-astro-floors/src/content.config'
import { xinfoSchema } from './app/schema'

const pois = defineCollection({
  loader: file('./src/content/pois.yaml'),
  schema: xinfoSchema,
})

export const collections = {
  ...commonCollections,
  pois,
}

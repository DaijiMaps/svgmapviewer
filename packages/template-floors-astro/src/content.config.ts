import { file } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { collections as collectionsCommon } from '../node_modules/svgmapviewer-astro-floors/src/content.config'
import { xinfoSchema } from './schema'

const pois = defineCollection({
  loader: file('./src/content/pois.yaml'),
  schema: xinfoSchema,
})

export const collections = {
  ...collectionsCommon,
  pois,
}

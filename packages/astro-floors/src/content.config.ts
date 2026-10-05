import fs from 'node:fs'

import type { Loader } from 'astro/loaders'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

import {
  addressSchema,
  addrsSchema,
  floorsConfigSchema,
  labelsSchema,
  mapCoordSchema,
  posSchema,
  svgMapViewerConfigUserSchema,
} from './schema'

// addressesCollection

const addressesEmptyLoader: Loader = {
  name: 'addresses-empty-loader',
  load: async ({ store }) => store.clear(),
  schema: addressSchema,
} satisfies Loader

export const addressesLoaderSchema = addressSchema
export const addressesLoader = (suffix: string) => {
  const path = `./src/content/addresses.${suffix}`
  return {
    name: 'addresses-loader',
    load: fs.existsSync(path) ? file(path).load : addressesEmptyLoader.load,
  } satisfies Loader
}

export const addressesCollection = (suffix: string) =>
  defineCollection({
    loader: addressesLoader(suffix),
    schema: addressesLoaderSchema,
  })

// namesCollection

const namesEmptyLoader = {
  name: 'names-empty-loader',
  load: async ({ store }) => store.clear(),
  schema: addrsSchema,
} satisfies Loader

export const namesLoaderSchema = addrsSchema
export const namesLoader = (suffix: string) => {
  const path = `./src/content/names.${suffix}`
  return {
    name: 'names-loader',
    load: fs.existsSync(path) ? file(path).load : namesEmptyLoader.load,
  } satisfies Loader
}

export const namesCollection = (suffix: string) =>
  defineCollection({
    loader: namesLoader(suffix),
    schema: namesLoaderSchema,
  })

// floorsCollection

export const floorsLoader = {
  name: 'floors-loader',
  schema: floorsConfigSchema,
  load: glob({
    base: './src/content/floors',
    pattern: '**/*.{json,yaml}',
  }).load,
} satisfies Loader

export const floorsCollection = defineCollection({ loader: floorsLoader })

// labelsCollection

export const labelsLoader = {
  name: 'labels-loader',
  load: glob({
    base: './src/content/labels',
    pattern: '**/*.{json,yaml}',
  }).load,
  schema: labelsSchema,
} satisfies Loader

export const labelsCollection = defineCollection({ loader: labelsLoader })

// svgMapViewerConfigCollection

export const svgMapViewerConfigLoader = {
  name: 'svgmapviewerconfig-loader',
  load: glob({
    base: './src/content/svgMapViewerConfig',
    pattern: '**/*.{json,yaml}',
  }).load,
  schema: svgMapViewerConfigUserSchema,
} satisfies Loader

export const svgMapViewerConfigCollection = defineCollection({
  loader: svgMapViewerConfigLoader,
})

// mapCoordCollection

export const mapCoordLoader = {
  name: 'mapcoord-loader',
  load: glob({
    base: './src/content/mapCoord',
    pattern: '**/*.{json,yaml}',
  }).load,
  schema: mapCoordSchema,
} satisfies Loader

export const mapCoordCollection = defineCollection({
  loader: mapCoordLoader,
})

// coordsCollection

export const coordsLoader = {
  name: 'coords-loader',
  load: glob({
    base: './src/content/coords',
    pattern: '**/*.{json,yaml}',
  }).load,
  schema: posSchema,
} satisfies Loader

export const coordsCollection = defineCollection({
  loader: coordsLoader,
})

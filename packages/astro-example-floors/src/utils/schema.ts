import { z } from 'zod'

export const posSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const boxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

export const nameSchema = z.union([z.string(), z.array(z.string())])

export const poiShopSchema = z.object({
  tag: z.literal('shop'),
})

export const poiFacilitySchema = z.object({
  tag: z.literal('facility'),
})

export const poiKindSchema = z.union([poiShopSchema, poiFacilitySchema])

export const poixSchema = z.object({
  tag: z.string(),
  kind: poiKindSchema,
})

export const poiSchema = z.object({
  id: z.string(),
  name: nameSchema,
  coord: posSchema,
  size: z.number(),
  fidx: z.number(),
  x: poixSchema,
})

//
//
//
//
//

const osmMapDataSchema = z.object({})

const osmMapMapSchema = z.object({})

const mapCoordSchema = z.object({})

export const uiConfigSchema = z.object({})

// osmDataConfigSchema
// osmRenderConfigSchema
// osmSearchConfigSchema

export const osmDataConfigSchema = z.object({
  origViewBox: boxSchema,
  mapData: osmMapDataSchema,
  mapMap: osmMapMapSchema,
  mapCoord: mapCoordSchema,
})

export const osmRenderConfigSchema = z.object({
  //renderMap
  //readonly isMapRendered: () => boolean
  //readonly getMapNames: OsmGetMapNames
  //readonly getMapPaths: () => readonly Readonly<OsmMapPathOps>[]
  //readonly getMapObjects: () => readonly Readonly<OsmMapObjects>[]
  //readonly getMapSymbols: () => readonly Readonly<OsmMapSymbols>[]
  //readonly getMapMarkers: () => readonly Readonly<OsmMapMarkers>[]
  //readonly mapSvgStyle: string
  //readonly cartoConfig?: OsmCartoConfig
})

export const osmSearchConfigSchema = z.object({
  //readonly osmSearchEntries: readonly Readonly<OsmSearchEntry>[] // XXX
  //readonly getSearchEntries: OsmGetSearchEntries
  //readonly getSearchInfo: OsmGetSearchInfo
  //readonly renderInfo: RenderInfo
})

// floorTspanSchema
// labelTextSchema
// floorSchema
// floorsConfigSchema

const labelTspanSchema = z.object({
  attrs: z.record(
    z.string(),
    z.union([z.undefined(), z.null(), z.number(), z.string()])
  ),
  text: z.union([z.null(), z.string()]),
})

const labelTextSchema = z.object({
  attrs: z.record(
    z.string(),
    z.union([z.undefined(), z.null(), z.number(), z.string()])
  ),
  children: z.array(labelTspanSchema),
})

export const floorSchema = z.object({
  name: z.string(),
  href: z.string(),
  labels: z.array(labelTextSchema).optional(),
})

export const floorsConfigSchema = z.object({})

// svgMapViewerConfigSchema

export const svgMapViewerConfigSchema = z.object({
  root: z.string(),
  href: z.string(),
  width: z.number(),
  height: z.number(),
  origViewBox: boxSchema, // XXX
  origBoundingBox: boxSchema.optional(), // XXX
  fontSize: z.number(),
  backgroundColor: z.string().optional(),
  title: z.string(),
  subtitle: z.string(),
  copyright: z.string(),
  zoomFactor: z.number(),
  floorsConfig: floorsConfigSchema.optional(),
  uiConfig: uiConfigSchema.optional(),
  //isContainerRendered: () => boolean
  //isUiRendered: () => boolean
})

export const svgMapViewerConfigUserSchema = svgMapViewerConfigSchema.partial()

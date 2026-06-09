import { z } from 'zod'

export const posSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const addrSchema = z.string()
export const addrsSchema = z.array(addrSchema)
//const nameEntrySchema = z.tuple([z.string(), addrsSchema])
const floorPosSchema = z.object({
  coord: posSchema,
  fidx: z.number(),
})
//const addressSchema = z.tuple([z.string(), floorPosSchema])

export const boxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

export const nameSchema = z.string() // z.union([z.string(), z.array(z.string())])

export const namesSchema = z.record(z.string(), nameSchema)

export const addressSchema = z.object({
  coord: posSchema,
  fidx: z.number(),
})

export const addressesSchema = addressSchema // z.record(z.string(), addressSchema)

// searchAddressesSchema
// searchNamesSchema

export const baseInfoSchema = z.object({
  title: z.string(),
})

const searchAddressSchema = z.object({
  address: z.string(),
  floorPos: floorPosSchema,
})
const searchNameSchema = z.object({
  name: z.string(),
  addresses: z.array(z.string()),
})
const searchInfoSchema = z.object({
  name: z.string(),
  info: baseInfoSchema,
})
export const searchAddressesSchema = z.array(searchAddressSchema)
export const searchNamesSchema = z.array(searchNameSchema)
export const searchInfosSchema = z.array(searchInfoSchema)

// osmMapDataSchema
// osmMapMapSchema
// mapCoordSchema
// uiConfigSchema

const osmMapDataSchema = z.object({})

const osmMapMapSchema = z.object({})

const mapCoordSchema = z.object({})

export const uiConfigSchema = z.object({
  showGuides: z.boolean(),
})

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
  //readonly RenderInfo: RenderInfo
})

// floorTspanSchema
// labelTextSchema
// floorSchema
// floorsConfigSchema

const labelTspanSchema = z.object({
  attrs: z.record(z.string(), z.union([z.null(), z.number(), z.string()])),
  text: z.union([z.null(), z.string()]),
})

const labelTextSchema = z.object({
  attrs: z.record(z.string(), z.union([z.null(), z.number(), z.string()])),
  children: z.array(labelTspanSchema),
})

export const floorSchema = z.object({
  name: z.string(),
  href: z.string(),
  file: z.string().optional(),
  labels: z.array(labelTextSchema).optional(),
})

export const floorsSchema = z.array(floorSchema)

export const floorsConfigSchema = z.object({
  initialFidx: z.number(),
  floors: z.array(floorSchema),
  //labelsMap: z.map(z.string(), z.array(labelTextSchema)).optional(),
})

// labelsSchema

export const labelsSchema = z.array(labelTextSchema)

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
  searchAddresses: searchAddressesSchema.optional(),
  searchNames: searchNamesSchema.optional(),
  searchInfos: searchInfosSchema.optional(),
  floorsConfig: floorsConfigSchema.optional(),
  uiConfig: uiConfigSchema.optional(),
  //isContainerRendered: () => boolean
  //isUiRendered: () => boolean
})

export const svgMapViewerConfigUserSchema = svgMapViewerConfigSchema.partial()

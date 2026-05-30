/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { writeFileSync } from 'node:fs'

import { z } from 'zod'

import {
  addressesSchema,
  floorsConfigSchema,
  addrsSchema,
  infoSchema,
  svgMapViewerConfigUserSchema,
} from '../src/utils/schema.ts'

const toRecord = (s) => z.record(z.string(), s)

const types = [
  { name: 'floorsConfig', schema: floorsConfigSchema.loose() },
  { name: 'addresses', schema: toRecord(addressesSchema) },
  { name: 'names', schema: toRecord(addrsSchema) },
  { name: 'pois', schema: toRecord(infoSchema) },
  {
    name: 'svgMapViewerConfigUser',
    schema: svgMapViewerConfigUserSchema.loose(),
  },
]

types.forEach((t) => {
  writeFileSync(
    `src/schema/${t.name}.schema.json`,
    JSON.stringify(t.schema.toJSONSchema(), null, 2)
  )
})

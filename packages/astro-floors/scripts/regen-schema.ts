/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { writeFileSync } from 'node:fs'

import { z } from 'zod'

import {
  addressesSchema,
  floorsConfigSchema,
  addrsSchema,
  svgMapViewerConfigUserSchema,
} from '../src/schema.ts'

type S = typeof addressesSchema | typeof addrsSchema
// eslint-disable-next-line functional/prefer-immutable-types
const toRecord = (s: S) => z.record(z.string(), s)

const types = [
  { name: 'floorsConfig', schema: floorsConfigSchema.loose() },
  { name: 'addresses', schema: toRecord(addressesSchema) },
  { name: 'names', schema: toRecord(addrsSchema) },
  {
    name: 'svgMapViewerConfigUser',
    schema: svgMapViewerConfigUserSchema.loose(),
  },
]

types.forEach((t) => {
  writeFileSync(
    `src/${t.name}.schema.json`,
    JSON.stringify(t.schema.toJSONSchema(), null, 2)
  )
})

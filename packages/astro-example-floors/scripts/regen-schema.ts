/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { writeFileSync } from 'node:fs'

import { z } from 'zod'

import { xinfoSchema } from '../src/app/schema.ts'
import {
  addressesSchema,
  floorsConfigSchema,
  addrsSchema,
  svgMapViewerConfigUserSchema,
} from '../src/utils/schema.ts'

type S = typeof addressesSchema | typeof addrsSchema | typeof xinfoSchema
// eslint-disable-next-line functional/prefer-immutable-types
const toRecord = (s: S) => z.record(z.string(), s)

const types = [
  { name: 'floorsConfig', schema: floorsConfigSchema.loose() },
  { name: 'addresses', schema: toRecord(addressesSchema) },
  { name: 'names', schema: toRecord(addrsSchema) },
  { name: 'pois', schema: toRecord(xinfoSchema) },
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

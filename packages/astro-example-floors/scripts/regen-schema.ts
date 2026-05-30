/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { writeFileSync } from 'node:fs'

import {
  addressesSchema,
  floorsConfigSchema,
  namesSchema,
  poiShopSchema,
  svgMapViewerConfigUserSchema,
} from '../src/utils/schema.ts'

const types = [
  { name: 'floorsConfig', schema: floorsConfigSchema.loose() },
  { name: 'addresses', schema: addressesSchema.loose() },
  { name: 'names', schema: namesSchema },
  { name: 'pois', schema: poiShopSchema.loose() },
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

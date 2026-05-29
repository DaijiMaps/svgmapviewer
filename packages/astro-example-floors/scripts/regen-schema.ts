/* eslint-disable functional/no-expression-statements */
import { writeFileSync } from 'node:fs'

import { svgMapViewerConfigUserSchema } from '../src/utils/schema.ts'

writeFileSync(
  'src/schema/svgMapViewerConfigUser.schema.json',
  JSON.stringify(svgMapViewerConfigUserSchema.loose().toJSONSchema(), null, 2)
)

/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { writeFileSync } from 'node:fs'

import { z } from 'zod'

import { xinfoSchema } from '../src/components/SvgMapViewer/schema.ts'

type S = typeof xinfoSchema
// eslint-disable-next-line functional/prefer-immutable-types
const toRecord = (s: S) => z.record(z.string(), s)

const types = [{ name: 'pois', schema: toRecord(xinfoSchema) }]

types.forEach((t) => {
  writeFileSync(
    `src/utils/schema/${t.name}.schema.json`,
    JSON.stringify(t.schema.toJSONSchema(), null, 2)
  )
})

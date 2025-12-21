import { z } from 'zod'

export const json = <T extends z.core.$ZodType>(
  schema: Readonly<T>
): z.ZodCodec<z.ZodString, Readonly<T>> =>
  z.codec(z.string(), schema, {
    decode: (jsonstr, ctx) => {
      try {
        return JSON.parse(jsonstr)
      } catch (e) {
        // eslint-disable-next-line functional/no-conditional-statements
        if (e instanceof z.ZodError) {
          // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
          ctx.issues.push({
            code: 'invalid_format',
            format: 'json',
            input: jsonstr,
            message: e.message,
          })
        }
        return z.NEVER
      }
    },
    encode: (val) => JSON.stringify(val),
  })

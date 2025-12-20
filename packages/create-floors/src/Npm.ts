import { Effect } from 'effect'
import * as HelpDoc from '@effect/cli/HelpDoc'
import validate from 'validate-npm-package-name'

export function validatePackageName(
  name: string
): Effect.Effect<string, HelpDoc.HelpDoc> {
  return Effect.gen(function* () {
    const result = validate(name)

    // XXX warnings

    if (result.errors && result.errors.length > 0) {
      return yield* Effect.fail(HelpDoc.blocks(result.errors.map(HelpDoc.p)))
    }

    return yield* Effect.succeed(name)
  })
}

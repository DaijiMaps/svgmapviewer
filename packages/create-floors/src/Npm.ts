import { Effect } from 'effect'
import { CliError } from 'effect/unstable/cli'
import validate from 'validate-npm-package-name'

export function validatePackageName(
  name: string
): Effect.Effect<string, CliError.InvalidValue> {
  return Effect.gen(function* () {
    const result = validate(name)

    // XXX warnings

    if (result.errors && result.errors.length > 0) {
      return yield* Effect.fail(
        new CliError.InvalidValue({
          option: 'packageName',
          value: name,
          expected: 'XXX',
          kind: 'argument',
        })
      )
    }

    return yield* Effect.succeed(name)
  })
}

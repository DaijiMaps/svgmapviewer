/* eslint-disable functional/no-expression-statements */
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'

import { convNames, saveAllTs } from './lib/print'

// XXX - split other_tags

const NodeContextLive = NodeContext.layer

const program = Effect.gen(function* () {
  return yield* convNames().pipe(Effect.zip(saveAllTs()))
}).pipe(Effect.provide(NodeContextLive))

NodeRuntime.runMain(program)

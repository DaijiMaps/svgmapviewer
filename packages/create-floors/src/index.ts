/* eslint-disable functional/no-expression-statements */
import { NodeContext, NodeHttpClient, NodeRuntime } from '@effect/platform-node'
import { Effect, Layer } from 'effect'

import { cli } from './Cli'
import { GitHubLive } from './GitHub'

const NodeContextLive = NodeContext.layer
const HttpClientLive = NodeHttpClient.layerUndici

const MainLive = GitHubLive.pipe(
  Layer.provide(HttpClientLive),
  Layer.provideMerge(NodeContextLive)
)

const nodeProgram = cli(process.argv).pipe(Effect.provide(MainLive))

NodeRuntime.runMain(nodeProgram)

/* eslint-disable functional/no-expression-statements */
import { Effect, Layer } from 'effect'
import * as NodeContext from '@effect/platform-node/NodeContext'
import * as NodeHttpClient from '@effect/platform-node/NodeHttpClient'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
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

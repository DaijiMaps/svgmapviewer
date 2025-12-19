/* eslint-disable functional/no-expression-statements */
import { Effect, Layer } from 'effect'
//import * as Options from '@effect/cli/Options'
//import * as Prompt from '@effect/cli/Prompt'
import * as NodeContext from '@effect/platform-node/NodeContext'
import * as NodeHttpClient from '@effect/platform-node/NodeHttpClient'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import { GitHub } from './GitHub'
import { cli } from './Cli'

const MainLive = GitHub.Default.pipe(
  Layer.provideMerge(
    Layer.mergeAll(NodeContext.layer, NodeHttpClient.layerUndici)
  )
)

cli(process.argv).pipe(Effect.provide(MainLive), NodeRuntime.runMain())

/* eslint-disable functional/no-expression-statements */
import { Effect, Layer } from 'effect'
import * as Args from '@effect/cli/Args'
import * as Command from '@effect/cli/Command'
//import * as Options from '@effect/cli/Options'
//import * as Prompt from '@effect/cli/Prompt'
import * as FileSystem from '@effect/platform/FileSystem'
import * as NodeContext from '@effect/platform-node/NodeContext'
import * as NodeHttpClient from '@effect/platform-node/NodeHttpClient'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import { GitHub } from './GitHub'

export interface TemplateConfig {
  readonly projectName: string
}

function createTemplate(config: Readonly<TemplateConfig>) {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem

    yield* fs.makeDirectory(config.projectName, { recursive: true })

    yield* GitHub.downloadTemplate(config)
  })
}

const projectName = Args.directory({
  name: 'project-name',
})

const options = {
  projectName,
}

const command = Command.make('create-svgmapviewer-floors-app', options).pipe(
  Command.withHandler(createTemplate)
)

const cli = Command.run(command, {
  name: 'Create svgmapviewer Floors App',
  version: 'v0.0.1',
})

const MainLive = GitHub.Default.pipe(
  Layer.provideMerge(
    Layer.mergeAll(NodeContext.layer, NodeHttpClient.layerUndici)
  )
)

cli(process.argv).pipe(Effect.provide(MainLive), NodeRuntime.runMain())

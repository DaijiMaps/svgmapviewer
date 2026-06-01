import { Effect, FileSystem, Path } from 'effect'
import { Argument, Command } from 'effect/unstable/cli'

import { GitHub } from './GitHub'
import { validatePackageName } from './Npm'

export interface TemplateConfig {
  readonly projectName: string
}

function createTemplate(config: Readonly<TemplateConfig>) {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const gh = yield* GitHub

    yield* fs.makeDirectory(config.projectName, { recursive: true })

    yield* gh.download('DaijiMaps', 'svgmapviewer-floors-app-template', {
      branch: 'main',
      cwd: config.projectName,
    })
  })
}

const projectName = Argument.directory('project-name', {
  mustExist: false,
}).pipe(
  Argument.withDescription('folder name created for generated npm app'),
  Argument.mapEffect(validatePackageName),
  Argument.mapEffect((projectName) =>
    Effect.map(Path.Path, (path) => path.resolve(projectName))
  )
)

const options = {
  projectName,
}

const command = Command.make('create-svgmapviewer-floors-app', options).pipe(
  Command.withHandler(createTemplate)
)

export const cli = Command.runWith(command, {
  version: 'v0.0.2',
})

import { Effect } from 'effect'
import { Args, Command } from '@effect/cli'
import { FileSystem, Path } from '@effect/platform'
import { GitHub } from './GitHub'
import { validatePackageName } from './Npm'

export interface TemplateConfig {
  readonly projectName: string
}

function createTemplate(config: Readonly<TemplateConfig>) {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem

    yield* fs.makeDirectory(config.projectName, { recursive: true })

    yield* GitHub.download('DaijiMaps', 'svgmapviewer-floors-app-template', {
      branch: 'main',
      cwd: config.projectName,
    })
  })
}

const projectName = Args.directory({
  name: 'project-name',
  exists: 'no',
}).pipe(
  Args.withDescription('folder name created for generated npm app'),
  Args.mapEffect(validatePackageName),
  Args.mapEffect((projectName) =>
    Effect.map(Path.Path, (path) => path.resolve(projectName))
  )
)

const options = {
  projectName,
}

const command = Command.make('create-svgmapviewer-floors-app', options).pipe(
  Command.withHandler(createTemplate)
)

export const cli = Command.run(command, {
  name: 'Create svgmapviewer Floors App',
  version: 'v0.0.1',
})

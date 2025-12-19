import * as HelpDoc from '@effect/cli/HelpDoc'
import * as ValidationError from '@effect/cli/ValidationError'
import * as NodeSink from '@effect/platform-node/NodeSink'
import * as HttpClient from '@effect/platform/HttpClient'
import * as HttpClientRequest from '@effect/platform/HttpClientRequest'
import * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import * as Effect from 'effect/Effect'
import * as Stream from 'effect/Stream'
import * as Tar from 'tar'
import type { TemplateConfig } from './Cli.ts'

const GET_URL = 'https://codeload.github.com'
const GET_PATH = '/DaijiMaps/svgmapviewer-floors-app-template/tar.gz/main'

// eslint-disable-next-line functional/no-classes, functional/no-class-inheritance
export class GitHub extends Effect.Service<GitHub>()('app/GitHub', {
  accessors: true,
  effect: Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient

    const client = httpClient.pipe(
      HttpClient.filterStatusOk,
      HttpClient.mapRequest(HttpClientRequest.prependUrl(GET_URL))
    )

    const downloadTemplate = (config: Readonly<TemplateConfig>) =>
      client.get(GET_PATH).pipe(
        HttpClientResponse.stream,
        Stream.run(
          NodeSink.fromWritable(
            () =>
              Tar.extract({
                cwd: config.projectName,
                strip: 1,
              }),
            () =>
              ValidationError.invalidValue(
                HelpDoc.p(`Failed to download template`)
              )
          )
        )
      )

    return {
      downloadTemplate,
    } as const
  }),
}) {}

export const GitHubLive = GitHub.Default

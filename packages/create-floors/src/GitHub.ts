import { Effect, Stream } from 'effect'
import { HelpDoc, ValidationError } from '@effect/cli'
import { HttpClient, HttpClientResponse } from '@effect/platform'
import { NodeSink } from '@effect/platform-node'
import * as Tar from 'tar'

const CODELOAD_URL = 'https://codeload.github.com'
const DEFAULT_BRANCH = 'main'

// eslint-disable-next-line functional/no-classes, functional/no-class-inheritance
export class GitHub extends Effect.Service<GitHub>()('app/GitHub', {
  accessors: true,
  effect: Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient

    const client = httpClient.pipe(HttpClient.filterStatusOk)

    const download = (
      username: string,
      repository: string,
      options?: Readonly<{
        branch?: string
        cwd?: string
      }>
    ) =>
      client
        .get(
          `${CODELOAD_URL}/${username}/${repository}/tar.gz/${options?.branch ?? DEFAULT_BRANCH}`
        )
        .pipe(
          HttpClientResponse.stream,
          Stream.run(
            NodeSink.fromWritable(
              () =>
                Tar.extract({
                  cwd: options?.cwd,
                  strip: 1,
                }),
              () =>
                ValidationError.invalidValue(
                  HelpDoc.p(`Failed to download tar.gz`)
                )
            )
          )
        )

    return {
      download,
    } as const
  }),
}) {}

export const GitHubLive = GitHub.Default

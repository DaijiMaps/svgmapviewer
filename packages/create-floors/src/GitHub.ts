import { NodeSink } from '@effect/platform-node'
import { Context, Effect, Layer, Schema, Stream } from 'effect'
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-class-inheritance */
/* eslint-disable functional/no-classes */
import { HttpClient, HttpClientResponse } from 'effect/unstable/http'
import { type HttpClientError } from 'effect/unstable/http/HttpClientError'
import * as Tar from 'tar'

const CODELOAD_URL = 'https://codeload.github.com'
const DEFAULT_BRANCH = 'main'

interface GitHubService {
  download: (
    username: string,
    repository: string,
    options?: Readonly<{
      branch?: string
      cwd?: string
    }>
  ) => Effect.Effect<void, HttpClientError | DownloadError>
}

class DownloadError extends Schema.TaggedErrorClass<DownloadError>()(
  'DownloadError',
  { cause: Schema.String }
) {}

export class GitHub extends Context.Service<GitHub, GitHubService>()(
  'app/GitHub',
  {
    //accessors: true,
    make: Effect.gen(function* () {
      const httpClient = yield* HttpClient.HttpClient

      const client = httpClient.pipe(HttpClient.filterStatusOk)

      const download = (
        username: string,
        repository: string,
        options?: Readonly<{
          branch?: string
          cwd?: string
        }>
      ): Effect.Effect<void, DownloadError> =>
        client
          .get(
            `${CODELOAD_URL}/${username}/${repository}/tar.gz/${options?.branch ?? DEFAULT_BRANCH}`
          )
          .pipe(
            HttpClientResponse.stream,
            Stream.run(
              NodeSink.fromWritable({
                evaluate: () =>
                  Tar.extract({
                    cwd: options?.cwd,
                    strip: 1,
                  }),
                onError: () => new Error(),
              })
            ),
            Effect.mapError(
              () => new DownloadError({ cause: 'tar extract failed' })
            )
          )

      return {
        download,
      }
    }),
  }
) {
  static readonly layer = Layer.effect(this, this.make)
}

export const GitHubLive = GitHub.layer

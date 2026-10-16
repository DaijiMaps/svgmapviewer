import { Schema } from 'effect'

const QuestionSchema = Schema.Struct({
  idx: Schema.Number,
  answeredAt: Schema.NullOr(Schema.DateFromString),
})
export type Question = typeof QuestionSchema.Type

const GameSchema = Schema.Struct({
  questions: Schema.Array(QuestionSchema),
  startedAt: Schema.NullOr(Schema.DateFromString),
  completedAt: Schema.NullOr(Schema.DateFromString),
  receivedAt: Schema.NullOr(Schema.DateFromString),
})
export type Game = typeof GameSchema.Type

/*
const SnapshotSchema = Schema.Struct({
  value: Schema.String,
})
*/

export const decodeGame = (obj: unknown): null | Game => {
  const res = Schema.decodeUnknownExit(GameSchema)(obj)
  return res._tag === 'Failure' ? null : res.value
}
export const encodeGame = (val: Game): null | unknown => {
  const res = Schema.encodeUnknownExit(GameSchema)(val)
  return res._tag === 'Failure' ? null : res.value
}

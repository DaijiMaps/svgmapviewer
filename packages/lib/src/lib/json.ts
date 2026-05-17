import { Schema } from 'effect'

export const json = <S extends Schema.Top>(
  schema: Readonly<S>
): Schema.fromJsonString<S> => Schema.fromJsonString(schema)

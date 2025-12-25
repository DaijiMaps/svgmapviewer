import { Schema } from 'effect'

type _User = {
  id: typeof Schema.Number
}

const User: Schema.Struct<_User> = Schema.Struct({
  id: Schema.Number,
})

export { User }

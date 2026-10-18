// game type
// - stamp
//   - name
//   - choices
//   - answer

export type QuizConfig =
  | {
      readonly type: 'Sort'
      readonly id: number
      readonly answer: string
      readonly pad: string
    }
  | {
      readonly type: 'Pick'
      readonly id: number
      readonly chars: string[]
    }

///

export type GameConfig = {
  readonly quizzes: readonly QuizConfig[]
}

export type Force = { readonly force?: boolean }

export type Question = {
  readonly idx: number
  readonly answered?: string
  readonly answeredAt?: string
}

export type Game = {
  readonly questions: readonly Question[]
  readonly startedAt?: string
  readonly completedAt?: string
  readonly receivedAt?: string
}

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
      readonly chars: string
    }

///

export type GameConfig = {
  readonly quizzes: readonly QuizConfig[]
}

export type Question = {
  readonly idx: number
  readonly answeredAt: undefined | Date
}

export type Game = {
  readonly questions: readonly Question[]
  readonly startedAt: undefined | Date
  readonly completedAt: undefined | Date
  readonly receivedAt: undefined | Date
}

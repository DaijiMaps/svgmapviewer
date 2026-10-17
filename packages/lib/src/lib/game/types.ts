// game type
// - stamp
//   - name
//   - choices
//   - answer

export type QuizConfig = {
  readonly id: number
  readonly answer: string
  readonly pad: string
}

///

export type GameConfig = {
  readonly questions: readonly number[]
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

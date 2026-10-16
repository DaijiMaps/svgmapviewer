// game type
// - stamp
//   - name
//   - choices
//   - answer

export type GameConfig = {
  questions: number[]
}

///

export type Question = {
  idx: number
  answeredAt: undefined | Date
}

export type Game = {
  questions: Question[]
  startedAt: undefined | Date
  completedAt: undefined | Date
  receivedAt: undefined | Date
}

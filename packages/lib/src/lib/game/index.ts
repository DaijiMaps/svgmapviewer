export { RenderGameReset } from './Game'

export type { GameContext, Question } from './game-xstate'
export { useGame } from './game-xstate'

export { RenderQuiz } from './Quiz'

export type { QuizEvent, QuizContext, Quiz } from './quiz-xstate'
export { makeQuiz, useQuiz } from './quiz-xstate'

export { notifyGame } from '../event-game'

export type { QuizConfig, GameConfig } from './types'

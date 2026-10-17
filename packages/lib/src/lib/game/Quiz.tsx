/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

import { useGame } from './game-xstate'
import type { Quiz } from './quiz-xstate'

function Char({
  quiz,
  char,
  disabled,
}: Readonly<{ quiz: Quiz; char: string; disabled: boolean }>): ReactNode {
  return (
    <>
      <p
        className={'char' + (disabled ? ' disabled' : '')}
        onClick={() => quiz.send({ type: 'Input', char })}
      >
        {char}
      </p>
    </>
  )
}

export function RenderQuiz(props: Readonly<{ quiz: Quiz }>): ReactNode {
  const game = useGame()
  const q = props.quiz.useQuiz()
  return (
    <>
      <p>クイズ 1</p>
      {game && q && (
        <>
          <p>
            こたえ:{' '}
            <span className="answer">
              {q.chars}
              {q.pad.repeat(q.answer.length - q.chars.length)}
            </span>
            {q.doneAt && ' ✅'}
            {!q.doneAt && (
              <span
                className={q.chars.length === 0 ? 'disabled' : undefined}
                onClick={() => props.quiz.send({ type: 'Delete' })}
              >
                {' '}
                ⏪
              </span>
            )}
          </p>
          <div className="chars">
            {Array.from(q.answer.split(''))
              .sort((a, b) => a.localeCompare(b))
              .map((c, idx) => (
                <Char
                  key={idx}
                  quiz={props.quiz}
                  char={c}
                  disabled={q.chars.indexOf(c) >= 0}
                />
              ))}
          </div>
        </>
      )}
      <style>{style}</style>
    </>
  )
}

const style = `
.answer {
  font-size: 1.3em;
  font-family: monospace;
  font-variant-numeric: tabular-nums;
  width: 8ch;
  letter-spacing: 0em;
}
.chars {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 1em 0;
  & > p.char {
    padding: 0.5em;
    border: 1px solid black;
    margin: 0.25em;
  }
}
.answered,
.disabled {
  opacity: 0.5;
}
`

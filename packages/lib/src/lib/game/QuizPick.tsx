/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

import type { Pick } from './quiz-pick-xstate'

function Char({
  pick,
  char,
  selected,
}: Readonly<{ pick: Pick; char: string; selected: boolean }>): ReactNode {
  return (
    <>
      <p
        className={'char' + (selected ? ' selected' : '')}
        onClick={() => pick.send({ type: 'Select', char })}
      >
        {char}
      </p>
    </>
  )
}

export function RenderPick(props: Readonly<{ pick: Pick }>): ReactNode {
  const q = props.pick.usePickContext()
  return (
    <>
      <p>クイズ 1</p>
      {q && (
        <>
          <div className="chars">
            {Array.from(q.chars)
              .sort((a, b) => a.localeCompare(b))
              .map((c, idx) => (
                <Char
                  key={idx}
                  pick={props.pick}
                  char={c}
                  selected={c === q.answered}
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

import { useSelector } from '@xstate/react'
import { createActor, setup } from 'xstate'

type Mode = 'M' | 'm'

interface EditorContext {
  mode: Mode
}

const editorMachie = setup({
  types: {
    context: {} as EditorContext,
  },
}).createMachine({
  id: 'editor1',
  context: {
    mode: 'M',
  },
})

const actor = createActor(editorMachie)

export function useEdotor(): Mode {
  return useSelector(actor, (s) => s.context.mode)
}
